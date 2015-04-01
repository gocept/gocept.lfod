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