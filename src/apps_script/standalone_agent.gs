function runOriginAgent() {
  // 1. Check for new requests in the Sheet
  processNewRequests();
  
  // 2. Check for updates/answers to clarifications
  processClarificationUpdates();
}

function installOriginAgentTriggers() {
  const handlers = ["runOriginAgent"];
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach((trigger) => {
    const handler = trigger.getHandlerFunction();
    if (handlers.indexOf(handler) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("runOriginAgent")
    .timeBased()
    .everyMinutes(15)
    .create();
}

function removeOriginAgentTriggers() {
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach((trigger) => {
    const handler = trigger.getHandlerFunction();
    if (handler === "runOriginAgent") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function setupOriginAgentConfig(config) {
  const props = PropertiesService.getScriptProperties();
  Object.keys(CONFIG_KEYS).forEach((key) => {
    const propKey = CONFIG_KEYS[key];
    if (config[propKey]) {
      props.setProperty(propKey, config[propKey]);
    }
  });
}
