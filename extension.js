/*
 * SPDX-License-Identifier: GPL-3.0-or-later
 * extension.js - Entry point for the Kiwi Menu GNOME Shell extension.
 */

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';

import { KiwiMenu } from './src/kiwimenu.js';

const GETTEXT_DOMAIN = 'gnome-shell-extensions-kiwimenu';

let gettextFunc = null;

export default class KiwiMenuExtension extends Extension {
  constructor(metadata) {
    super(metadata);
    
    // Initialize gettext domain
    const localeDir = GLib.build_filenamev([this.path, 'locale']);
    
    try {
      // Use the compatibility imports.gettext API
      imports.gettext.bindtextdomain(GETTEXT_DOMAIN, localeDir);
      gettextFunc = imports.gettext.domain(GETTEXT_DOMAIN).gettext;
    } catch (e) {
      console.error('Failed to initialize gettext:', e);
      gettextFunc = (text) => text; // Fallback to identity function
    }
  }

  enable() {
    this._settings = this.getSettings();
    this._indicator = new KiwiMenu(this._settings, this.path, this);
    Main.panel.addToStatusArea('KiwiMenuButton', this._indicator, 0, 'left');
  }

  disable() {
    if (this._indicator) {
      this._indicator.destroy();
      this._indicator = null;
    }

    this._settings = null;
  }
  
  gettext(text) {
    return gettextFunc ? gettextFunc(text) : text;
  }
}
