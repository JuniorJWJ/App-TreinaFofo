package com.anonymous.treinafofo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WaterWidgetModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "WaterWidget"

  @ReactMethod
  fun update(current: Int, goal: Int) {
    val context = reactApplicationContext
    WaterWidgetProvider.saveValues(context, current, goal)
    WaterWidgetProvider.updateAllWidgets(context, current, goal)
  }
}
