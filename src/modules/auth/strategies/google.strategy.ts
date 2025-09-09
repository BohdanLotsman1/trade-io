// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // https://api.example.com/auth/google/callback
      scope: ['profile', 'email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value ?? null;
    const name = profile.displayName ?? null;
    const avatarUrl = profile.photos?.[0]?.value ?? null;
    return {
      provider: 'google',
      providerAccountId: profile.id,
      email,
      name,
      avatarUrl,
      accessToken,
      refreshToken,
    };
  }
}
