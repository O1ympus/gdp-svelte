import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const SECRET = env.JWT_SECRET || 'supersecret';

if (!env.JWT_SECRET && env.NODE_ENV === 'production') {
	console.warn('WARNING: JWT_SECRET not set in production! Using default secret.');
}

export interface JWTPayload {
	id: number;
	username: string;
}

export function signToken(payload: JWTPayload) {
	return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, SECRET) as JWTPayload;
	} catch {
		return null;
	}
}
