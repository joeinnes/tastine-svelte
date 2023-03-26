import { PUBLIC_API_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
export const db = new PocketBase(PUBLIC_API_URL);
