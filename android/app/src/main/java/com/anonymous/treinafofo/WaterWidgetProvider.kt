package com.anonymous.treinafofo

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.widget.RemoteViews

class WaterWidgetProvider : AppWidgetProvider() {
  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    val action = intent.action ?: return
    if (action == ACTION_ADD_200 || action == ACTION_ADD_500) {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val current = prefs.getInt(KEY_CURRENT, 0)
      val goal = prefs.getInt(KEY_GOAL, 0)
      val addAmount = if (action == ACTION_ADD_200) 200 else 500
      val next = current + addAmount
      saveValues(context, next, goal)
      updateAllWidgets(context, next, goal)
    }
  }

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val current = prefs.getInt(KEY_CURRENT, 0)
    val goal = prefs.getInt(KEY_GOAL, 0)

    for (appWidgetId in appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId, current, goal)
    }
  }

  companion object {
    private const val PREFS_NAME = "water_widget_prefs"
    private const val KEY_CURRENT = "currentIntake"
    private const val KEY_GOAL = "dailyGoal"
    private const val ACTION_ADD_200 = "com.anonymous.treinafofo.WATER_ADD_200"
    private const val ACTION_ADD_500 = "com.anonymous.treinafofo.WATER_ADD_500"

    fun updateAllWidgets(context: Context, current: Int, goal: Int) {
      val manager = AppWidgetManager.getInstance(context)
      val widgetIds = manager.getAppWidgetIds(
        ComponentName(context, WaterWidgetProvider::class.java)
      )
      for (widgetId in widgetIds) {
        updateAppWidget(context, manager, widgetId, current, goal)
      }
    }

    fun saveValues(context: Context, current: Int, goal: Int) {
      val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      prefs.edit().putInt(KEY_CURRENT, current).putInt(KEY_GOAL, goal).apply()
    }

    private fun updateAppWidget(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetId: Int,
      current: Int,
      goal: Int
    ) {
      val views = RemoteViews(context.packageName, R.layout.water_widget)
      views.setTextViewText(R.id.water_current, "${current} ml")
      views.setTextViewText(R.id.water_goal, "Meta: ${goal} ml")

      val percent = if (goal > 0) (current * 100 / goal) else 0
      views.setTextViewText(R.id.water_percent, "${percent}%")
      val remaining = (goal - current).coerceAtLeast(0)
      views.setTextViewText(R.id.water_remaining, "Faltam ${remaining} ml")
      views.setProgressBar(R.id.water_progress, 100, percent.coerceAtMost(100), false)

      val add200Intent = Intent(context, WaterWidgetProvider::class.java).apply {
        action = ACTION_ADD_200
      }
      val add500Intent = Intent(context, WaterWidgetProvider::class.java).apply {
        action = ACTION_ADD_500
      }

      val add200Pending = android.app.PendingIntent.getBroadcast(
        context,
        appWidgetId + 200,
        add200Intent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE
      )
      val add500Pending = android.app.PendingIntent.getBroadcast(
        context,
        appWidgetId + 500,
        add500Intent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE
      )

      views.setOnClickPendingIntent(R.id.water_add_200, add200Pending)
      views.setOnClickPendingIntent(R.id.water_add_500, add500Pending)

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
