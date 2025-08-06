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

  useEffect(() => {
    const printTypes = [];
    if (printInvoice) {
      printTypes.push("Invoice");
    };
    if (printPackingSlip) {
      printTypes.push("Packing Slip");
    };

    if (printTypes.length > 0) {
      const params = new URLSearchParams({
        printType: printTypes.join(","),
        orderId: data.selected[0].id,
      });
      const fullSrc = `/print?${params.toString()}`;
      setSrc(fullSrc);
    } else {
      setSrc(null);
    }
  }, [data.selected, printInvoice, printPackingSlip]);

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
        { !printInvoice && !printPackingSlip && (
          <Banner tone="warning" title={i18n.translate('warningTitle')}>
            {i18n.translate('warningBody')}
          </Banner>
        )}
        <Text fontWeight="bold">{i18n.translate('documents')}</Text>
        <Checkbox
          name="Invoice"
          checked={printInvoice}
          onChange={(value) => {
            setPrintInvoice(value);
          }}
        >
         {i18n.translate('printInvoice')}
        </Checkbox>
        <Checkbox
          name="Packing Slip"
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