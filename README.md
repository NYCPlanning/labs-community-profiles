# labs-community-portal

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd labs-community-portal`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## MapPLUTO Floodplain Lookup

WITH floodplain_2015 as (
  SELECT the_geom FROM support_waterfront_pfirm15 WHERE fld_zone = 'AE' OR fld_zone = 'VE'
)

SELECT
a.bbl,
ST_Intersects( a.the_geom , cdprofiles_floodplain_2050.the_geom ) as floodplain_2050,
EXISTS(
  SELECT 1 FROM floodplain_2015 b WHERE ST_INtersects(a.the_geom, b.the_geom)
) as floodplain_2015
FROM support_mappluto a, cdprofiles_floodplain_2050
