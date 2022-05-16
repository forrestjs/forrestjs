const { SYMBOLS, SEPARATOR } = require('./constants');
const {
  appendTrace,
  getCurrentStack,
  getTraceContext,
  getState,
} = require('./state');

const traceAction = (action, options = {}) => {
  const { trace } = options;

  appendTrace(trace, {
    hook: action.hook,
    name: action.name,
    trace: action.trace,
    meta: action.meta,
    priority: action.priority,
    stack: getCurrentStack(),
  });
};

// should use the "stack" info to nest items into each other
const nestObjects = (list) => {
  // const result = []
  // let parent = null

  // for (const item of list) {
  //     if (item.stack.length === 1) {
  //         parent = item
  //         result.push({
  //             ...item,
  //             children: [],
  //         })
  //     } else {
  //         parent.children.push(item)
  //         // console.log('>>>>>')
  //         // console.log(parent)
  //         // console.log(item)
  //         // console.log('<<<<<')
  //     }

  //     console.log(item)
  // }

  // console.log('')
  // console.log('')
  // console.log('')

  return list;
};

const traceHook =
  (ctx = 'boot') =>
  (density = 'normal') => {
    const trace = getTraceContext(ctx);
    const records = trace.map((record) => {
      switch (density) {
        case 'full':
          return record;
        case 'normal':
          return {
            hook: record.hook,
            name: record.name,
            priority: record.priority,
            trace: record.trace,
            meta: record.meta,
            stack: record.stack,
          };
        case 'compact':
          const depth = '  '.repeat(record.stack.length - 1);
          const sep = SYMBOLS.includes(record.hook[0]) ? ' ' : SEPARATOR;
          return {
            hook: `${depth}${record.name}${sep}${record.hook}`,
            stack: record.stack,
          };
        default:
          throw new Error(`[hook] unknown trace density "${density}"`);
      }
    });

    return (output = 'json') => {
      switch (output) {
        case 'json':
          return nestObjects(records);
        case 'cli':
          return records.map((record) => record.hook);
        default:
          throw new Error(`[hook] unknown trace output "${output}"`);
      }
    };
  };

const logTrace =
  (log) =>
  (ctx) =>
  (options = {}) => {
    const ctxTrace = traceHook(ctx)('compact')('cli').join('\n');
    const title = `  @hooks - ${options.title || 'stack trace'}  `;
    log('');
    log('');
    log('-'.repeat(title.length));
    log(title);
    log('-'.repeat(title.length));
    log('');
    if (options.showBoot) {
      const bootTrace = traceHook('boot')('compact')('cli').join('\n');
      log(bootTrace);
    }
    log(ctxTrace);
    log('');
    log('');
  };

const logBoot = (log = console.log) => logTrace(log)('boot')({ title: 'boot' });

traceHook.getHooks = (a) => getState().hooks[a];

module.exports = {
  traceAction,
  nestObjects,
  traceHook,
  logTrace,
  logBoot,
};
