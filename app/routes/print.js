import { authenticate } from '../shopify.server';

export async function loader({ request }) {
    const { cors, admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const query = url.searchParams;
    const docs = query.get("printType").split(",");
    const orderId = query.get("orderId");
    const response = await admin.graphql(
        `query getOrder(?orderId: ID!) {
        order(id: $orderId) {
            name
            createdAt
            totalPriceSet {
                shopMoney {
                    amount
                }
            }
        }
    }`,
        {
            variables: {
                orderId
            },
        }
    );
    const orderData = await response.json();
    const order = orderData.data.order;

    return null; // Placeholder for actual response handling
}