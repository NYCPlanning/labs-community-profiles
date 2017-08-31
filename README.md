# labs-community-portal

An ember single-page app that displays useful information, maps, and charts at the NYC community-district level.

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

### Deploying

Deploy with dokku: `git push {dokku remote} master`

## Backend Services

### carto

#### App-specific tables:
- `community_district_profiles` - a wide table with one row for each community district and a column for each indicator
- `cdprofiles_studies_plans` - a row for each dcp study/plan with its associated community districts
- `cdprofiles_197a_plans` - a row for each 197a plan with its associated community districts

#### Supporting tables
- `support_mappluto` - mappluto 16v2
- `support_waterfront_pfirm` - 2015 Preliminary Flood Insurance Rate Map, for calculating things in the floodplain
- `cdprofiles_floodplain_2050` - future floodplain shapefile (for visualization only)
- `facilities_facdb` - the NYC facilities Database

### LUCATS Proxy
A Proxy API that scrapes LUCATS in real-time and produces JSON for a community district's projects.  [https://github.com/NYCPlanning/labs-lucats-proxy](https://github.com/NYCPlanning/labs-lucats-proxy)

### Land Use Tiles
A tile microservice that serves vector and raster tiles for NYC PLUTO data.  It is used in the land use maps because we had issues generating tiles with thousands of polygons on them to show land use at medium zoom levels.  [https://github.com/NYCPlanning/labs-land-use-tiles](https://github.com/NYCPlanning/labs-land-use-tiles)

## Device Testing
We use BrowserStack (free for open source projects) to do device testing.
![https://www.browserstack.com/images/layout/browserstack-logo-600x315.png]
