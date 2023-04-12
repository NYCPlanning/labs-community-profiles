import Application from 'labs-community-portal/app';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

setApplication(Application.create({ autoboot: false }));

setup(QUnit.assert);

start();
