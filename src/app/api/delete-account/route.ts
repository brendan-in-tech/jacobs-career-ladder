import { NextResponse, NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import limiter from '@/middleware/rateLimit';

export async function DELETE(request: NextRequest) {
  // Apply rate limiting
  const headers = limiter.checkNext(request, 10);
  if (headers instanceof NextResponse) {
    return headers;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
        }),
      });
    }
    const db = getFirestore();
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Set TTL for 30 days from now
    const ttlDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const now = Date.now();

    // Mark user document for deletion
    await db.collection('users').doc(userId).update({
      markedForDeletionAt: now,
      ttl: ttlDate
    });

    // Mark all applications for deletion
    const apps = await db.collection('applications').where('userId', '==', userId).get();
    const appUpdates = apps.docs.map(doc => doc.ref.update({
      markedForDeletionAt: now,
      ttl: ttlDate
    }));
    await Promise.all(appUpdates);

    // Mark all email events for deletion
    const events = await db.collection('emailEvents').where('userId', '==', userId).get();
    const eventUpdates = events.docs.map(doc => doc.ref.update({
      markedForDeletionAt: now,
      ttl: ttlDate
    }));
    await Promise.all(eventUpdates);

    // Optionally, disable Firebase Auth user (instead of deleting immediately)
    await auth().updateUser(userId, { disabled: true });

    return new NextResponse(JSON.stringify({ success: true, scheduledDeletion: ttlDate }), { status: 200 });
  } catch (error) {
    console.error('Error marking account for deletion:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 