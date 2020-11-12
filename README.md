# newsletter

TrueNorth Newsletter templates and assets.

### Dev notes

Using [MJML](https://mjml.io/) to generate the marukups. [Learn more](https://mjml.io/documentation/#basic-layout-example)

Compiles the file and outputs the HTML generated in output.html:

`./node_modules/.bin/mjml templates/sales.mjml -o dist/sales.html`

Development script passing filename as a template flag:

`npm run dev --t=templateName`

[Try it Live](https://mjml.io/try-it-live/)
