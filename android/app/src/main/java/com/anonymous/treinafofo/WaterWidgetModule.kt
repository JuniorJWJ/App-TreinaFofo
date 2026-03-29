package com.anonymous.treinafofo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class WaterWidgetModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "WaterWidget"

  @ReactMethod
  fun update(current: Int, goal: Int) {
    val context = reactApplicationContext
    WaterWidgetProvider.saveValues(context, current, goal)
    WaterWidgetProvider.updateAllWidgets(context, current, goal)
  }

  @ReactMethod
  fun getValues(promise: Promise) {
    try {
      val context = reactApplicationContext
      val prefs = context.getSharedPreferences("water_widget_prefs", ReactApplicationContext.MODE_PRIVATE)
      val current = prefs.getInt("currentIntake", 0)
      val goal = prefs.getInt("dailyGoal", 0)
      val result = com.facebook.react.bridge.Arguments.createMap()
      result.putInt("current", current)
      result.putInt("goal", goal)
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("ERR_WIDGET", e)
    }
  }
}
