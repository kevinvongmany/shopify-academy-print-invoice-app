import {
  reactExtension,
  useApi,
  AdminPrintAction,
  Banner,
  BlockStack,
  Checkbox,
  Text,
} from "@shopify/ui-extensions-react/admin";
import { useEffect, useState } from "react";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = "admin.order-details.print-action.render";


export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const {i18n, data} = useApi(TARGET);
  const [src, setSrc] = useState(null);
  // It's best practice to load a printable src when first launching the extension.
  const [printInvoice, setPrintInvoice] = useState(true);
  const [printPackingSlip, setPrintPackingSlip] = useState(false);
  // data has information about the resource to be printed.

  /*
    This template fetches static documents from the CDN to demonstrate printing.
    However, when building your extension, you should update the src document
    to match the resource that the user is printing. You can do this by getting the
    resource id from the data API and using it to create a URL with a path to your app
    that shows the correct document. For example, you might use a URL parameter to
    render an invoice for a specific order.

    `/print/invoice&orderId=${data.selected[0].id}`
  */
  useEffect(() => {
    const foo = "bar";
  }, [printInvoice, printPackingSlip]);

  return (
    /*
      The AdminPrintAction component provides an API for setting the src of the Print Action extension wrapper.
      The document you set as src will be displayed as a print preview.
      When the user clicks the Print button, the browser will print that document.
      HTML, PDFs and images are supported.

      The `src` prop can be a...
        - Full URL: https://cdn.shopify.com/static/extensibility/print-example/printInvoice.html
        - Relative path in your app: print-example/printInvoice.html or /print-example/printInvoice.html
        - Custom app: protocol: app:print (https://shopify.dev/docs/api/admin-extensions#custom-protocols)
    */
    <AdminPrintAction src={src}>
      <BlockStack blockGap="base">
        <Banner tone="warning" title={i18n.translate('warningTitle')}>
          {i18n.translate('warningBody')}
        </Banner>
        <Text fontWeight="bold">{i18n.translate('documents')}</Text>
        <Checkbox
          name="document-1"
          checked={printInvoice}
          onChange={(value) => {
            setPrintInvoice(value);
          }}
        >
         {i18n.translate('printInvoice')}
        </Checkbox>
        <Checkbox
          name="document-2"
          checked={printPackingSlip}
          onChange={(value) => {
            setPrintPackingSlip(value);
          }}
        >
         {i18n.translate('printPackingSlip')}
        </Checkbox>
      </BlockStack>
    </AdminPrintAction>
  );
}