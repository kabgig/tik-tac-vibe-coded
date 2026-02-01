import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/utils/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, firstName, lastName } = await request.json();

    console.log('=== User Track Request ===');
    console.log('User data:', { userId, userName, firstName, lastName });
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

    // Validate input
    if (!userId || !firstName) {
      return NextResponse.json(
        { error: 'userId and firstName are required' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Check if user exists
    console.log('Checking if user exists...');
    let user = await User.findOne({ userId });
    console.log('User exists:', !!user);

    if (user) {
      // User exists, return existing user
      console.log('Returning existing user');
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          userId: user.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          funnelStage: user.funnelStage,
        },
      });
    }

    // User doesn't exist, create new user
    console.log('Creating new user...');
    user = await User.create({
      userId,
      userName,
      firstName,
      lastName,
      chatId: userId, // Using userId as chatId for Telegram users
      role: 'client',
      funnelStage: 'lead_captured',
      tags: ['lead_captured'],
      messagesSent: [],
      isActive: true,
      blocked: false,
    });
    console.log('User created successfully:', user._id);

    return NextResponse.json({
      success: true,
      exists: false,
      created: true,
      user: {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        funnelStage: user.funnelStage,
      },
    });
  } catch (error) {
    console.error('User tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
