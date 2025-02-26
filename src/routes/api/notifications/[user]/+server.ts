import { CONTACT_EMAIL, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '$env/static/private';
import { PUBLIC_VITE_APP_NAME } from '$env/static/public';
import dexie from '$lib/dexie';
import { type RequestEvent } from '@sveltejs/kit';
import webpush, { WebPushError } from 'web-push';

webpush.setVapidDetails(`mailto:${CONTACT_EMAIL}`, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export const POST = async ({ params, request }: RequestEvent) => {
    const user = params?.user;
    if (!user) {
        return new Response(JSON.stringify({ error: 'User is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const body = await request.json();
        if (!body.message) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        dexie.createNotification(user, body.message);

        const subscription = await dexie.getSubscription(user);
        if (!subscription) {
            return new Response(JSON.stringify({ error: 'No subscription found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        try {
            await webpush.sendNotification(
                subscription.subscription,
                JSON.stringify({
                    title: PUBLIC_VITE_APP_NAME,
                    message: body.message,
                })
            );

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.error('Failed to send notification:', err);
            if ((err as WebPushError).statusCode === 410) {
                console.error(`Subscription expired, deleting subscription: ${subscription.id}`);
                await dexie.deleteSubscription(subscription.id);
            }
            return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}