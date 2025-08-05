import {authenticate} from '../shopify.server';

export async function loader({ request }) {
    const { cors, admin } = await authenticate.admin(request);


    return null; // Placeholder for actual response handling
}