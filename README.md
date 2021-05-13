[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-community-profiles/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-community-profiles/tree/develop)

# labs-community-profiles

The Community District Profiles organize a wide variety of data, maps, and other content to present an accessible and informative view of the built environment, key socio-economic conditions, community board perspectives, and planning activities in each district. This information empowers residents, community board members, planners, and other stakeholders to engage in city planning and advocate for their communities.

## How we work

[NYC Planning Labs](https://planninglabs.nyc) takes on a single project at a time, working closely with our customers from concept to delivery in a matter of weeks.  We conduct regular maintenance between larger projects.  

Take a look at our sprint planning board {link to waffle} to get an idea of our current priorities for this project.

## How you can help

In the spirit of free software, everyone is encouraged to help improve this project.  Here are some ways you can contribute.

- Comment on or clarify [issues](link to issues)
- Report [bugs](link to bugs)
- Suggest new features
- Write or edit documentation
- Write code (no patch is too small)
  - Fix typos
  - Add comments
  - Clean up code
  - Add new features

**[Read more about contributing.](CONTRIBUTING.md)**


## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with NPM)
  - This installation was tested using Node v12.22.1
- [Ember CLI](https://ember-cli.com/)
- [Yarn](https://yarnpkg.com/)

## Local development

- Clone this repo `git clone https://github.com/NYCPlanning/labs-community-profiles.git`
- Install Dependencies `yarn`
- Start the server `ember s`
- Point your browser to `http://localhost:4200`

## Architecture

Community Profiles consists of a landing page and a route for each of NYC's 59 Community Districts.  The landing page allows the user to search for their neighborhood, choose a community district from a dropdown, or click a community district from the map.

Once on a profile route, a long-scrolling page of charts, maps, and other content display the data.  

Each profile has a model that pulls one row from the `community_district_profiles` table and contains most of the data necessary to render the profile.  The reports are Componentized where possible, using ember components to make sections or sub-sections self-contained.  

## Backend services

- **mapzen api** - Description of this service
- {Replace this list with the app's backend service dependencies.}

### carto
Most of the data use by the app is stored in tables on the planninglabs carto instance.

#### App-specific tables:
- `community_district_profiles` - an aliased view of a wide table with one row for each community district and a column for each indicator
- `community_profiles_floodplain` - same as above, but specific to waterfront/resiliency data used in the Floodplain section charts.
- `cdprofiles_studies_plans` - a row for each dcp study/plan with its associated community districts
- `cdprofiles_197a_plans` - a row for each 197a plan with its associated community districts

#### Supporting tables
- `mappluto` - aliased view of the latest MapPLUTO version
- `facdb` - aliased view of the latest NYC facilities Database
- `merged_pfirm_firm_100yr_v201901` - Merged version of 2007 Food Insurance Rate Map and 2015 Preliminary Flood Insurance Rate Map 100 yr floodplain boundary, used for vizualizing and calculating things in the floodplain
- `merged_pfirm_firm_500yr_v201901` - Merged version of 2007 Food Insurance Rate Map and 2015 Preliminary Flood Insurance Rate Map 500 yr floodplain boundary, used for vizualizing and calculating things in the floodplain
- `zoning_districts` - aliased view of the latest zoning dataset version

### github static content
- static JSON files for the zoning chart are accessed via the github raw files api using [https://github.com/NYCPlanning/labs-community-data](https://github.com/NYCPlanning/labs-community-data)

### mapzen search API
[Mapzen search](https://mapzen.com/products/search/geocoding/) is used for autocomplete address searching.  

### ZAP Proxy
A Proxy API that pulls data for a community district using ZAP's odata API, creating nice-looking URLs for a community district's projects.  [https://github.com/NYCPlanning/labs-zap-proxy](https://github.com/NYCPlanning/labs-zap-proxy)


## Testing and checks

- **ESLint** - We use ESLint with Airbnb's rules for JavaScript projects
  - Add an ESLint plugin to your text editor to highlight broken rules while you code
  - You can also run `eslint` at the command line with the `--fix` flag to automatically fix some errors.

- **Testing**
  - run `ember test --serve`
  - Before creating a Pull Request, make sure your branch is updated with the latest `develop` and passes all tests

## Deployment

Add `dokku` remote: `git remote add dokku dokku@{dokkudomain}:communityprofiles`
Deploy with dokku: `git push dokku master`

NOTE: When making updates in the app that are dependent on a data update, be sure to check the Data Update Playbook for further instructions. Read through this update process before running the labs-layers-api python script or promoting changes to develop and production. 

## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)

## Device Testing
We use BrowserStack (free for open source projects) to do device testing.
<img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="200">
