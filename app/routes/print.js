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
    const pages = docs.map((docType) => orderPage(docType, order));
    const print = printHTML(pages);

    return null; // Placeholder for actual response handling
}

function orderPage(docType, order) {
    const price = order.totalPriceSet.shopMoney.amount;
    const name = order.name;
    const createdAt = order.createdAt.split("T")[0];
    const email = "<!--email_off-->placeholder@email.com<!--/email_off-->";
    return `<main>
      <div>
        <div class="columns">
          <h1>${docType}</h1>
          <div>
            <p style="text-align: right; margin: 0;">
              Order ${name}<br>
              ${createdAt}
            </p>
          </div>
        </div>
        <div class="columns" style="margin-top: 1.5em;">
          <div class="address">
            <strong>From</strong><br>
            A Strong Company<br>
            <p>443 Barry Street<br>
              Mascot NSW 2220<br>
              Australia</p>
            (02) 9994 4999<br>
          </div>
        </div>
        <hr>
        <p>Order total: $${price}</p>
        <p style="margin-bottom: 0;">If you have any questions, please send an email to ${email}</p>
      </div>
    </main>`;
}

function printHTML(pages) {
    const title = `<title>Print Order Invoice</title>`;

    return null
}