import { NextResponse, NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import limiter from '@/middleware/rateLimit';

interface UserData {
  id: string;
  email?: string;
  [key: string]: any;
}

interface Application {
  id: string;
  userId: string;
  [key: string]: any;
}

interface EmailEvent {
  id: string;
  userId: string;
  [key: string]: any;
}

interface ExportData {
  user: UserData;
  applications: Application[];
  emailEvents: EmailEvent[];
  exportDate: string;
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const headers = limiter.checkNext(request, 10);
  if (headers instanceof NextResponse) {
    return headers;
  }

  try {
    // Initialize Firebase Admin if it hasn't been initialized
    if (!getApps().length) {
      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        console.error('Firebase Admin initialization error:', error);
        return new NextResponse('Firebase Admin initialization error', { status: 500 });
      }
    }

    // Now get Firestore (after initialization)
    const db = getFirestore();

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the JWT token
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth().verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return new NextResponse('Invalid token', { status: 401 });
    }
    
    const userId = decodedToken.uid;

    // Fetch user data
    let userData: UserData;
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const data = userDoc.data();
      userData = {
        id: userId,
        ...(data || {})
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return new NextResponse('Error fetching user data', { status: 500 });
    }

    // Fetch job applications
    let applications: Application[] = [];
    try {
      const applicationsSnapshot = await db
        .collection('applications')
        .where('userId', '==', userId)
        .get();
      applications = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        userId,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Continue with empty applications array
    }

    // Fetch email events
    let emailEvents: EmailEvent[] = [];
    try {
      const emailEventsSnapshot = await db
        .collection('emailEvents')
        .where('userId', '==', userId)
        .get();
      emailEvents = emailEventsSnapshot.docs.map(doc => ({
        id: doc.id,
        userId,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching email events:', error);
      // Continue with empty email events array
    }

    // Combine all data
    const exportData: ExportData = {
      user: userData,
      applications,
      emailEvents,
      exportDate: new Date().toISOString()
    };

    // Return the data as a JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="jacobs-ladder-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('Unexpected error in export-data:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 