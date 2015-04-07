# Cordova

## Install

>>> npm install -g cordova
>>> npm install -g ios-sim
>>> cordova platform add ios
>>> cordova build
>>> cordova emulate ios

## Hide Status Bar

* Add platforms folder to version control
* Ignore all volatile files
* Adjust `platforms/ios/LunchFetcher/LunchFetcher-Info.plist` to include

<key>UIStatusBarHidden</key>
<true/>
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>

## Disable Push Notification API

* It's not used atm, but cordova creates the API functions anyway, resulting in
  a warning by Apple
* Go to `platforms/ios/LunchFetcher/Classes/AppDelegate.m` and remove
  everything which is wrapped inside `#ifndef DISABLE_PUSH_NOTIFICATIONS`
  (only worked for older versions of cordova)
