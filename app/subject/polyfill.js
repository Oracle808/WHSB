// *
//     EMCAScript 5 - De Flamma
// *

// Function.prototype.bind
Function.prototype.bind = Function.prototype.bind || function(oThis) {
    if (typeof this !== "function") {
	// closest thing possible to the ECMAScript 5 internal IsCallable function
	throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function () {},
    fBound = function () {
	return fToBind.apply(
	    this instanceof fNOP && oThis ? this : oThis,
	    aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
};

// *
//     EMCAScript 6
// *

if (typeof WeakMap === 'undefined') {
    (function() {
	var defineProperty = Object.defineProperty;
	var counter = Date.now() % 1e9;

	var WeakMapPolyfill = function() {
	this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
      };

      WeakMapPolyfill.prototype = {
	set: function(key, value) {
	  var entry = key[this.name];
	  if (entry && entry[0] === key)
	    entry[1] = value;
	  else
	    defineProperty(key, this.name, {value: [key, value], writable: true});
	},
	get: function(key) {
	  var entry;
	  return (entry = key[this.name]) && entry[0] === key ?
	      entry[1] : undefined;
	},
	'delete': function(key) {
	  this.set(key, undefined);
	}
      };

      window.WeakMapPolyfill = WeakMapPolyfill;
      window.WeakMap = WeakMapPolyfill;
    })();
}

// *
//     DOM Living Standard
// *

const TAG_NAME = /^[a-zA-Z]+$/;

const mutationMacro = function(nodes) {
    if(nodes.length === 1) {
	return typeof nodes === "string" ? window.document.createTextNode(nodes) : nodes;
    } 
    var fragment = window.document.createDocumentFragment();
    var list = Array.prototype.slice.call(nodes);
    for(var i = 0; i < list.length; i++) {
	fragment.appendChild(typeof nodes === "string" ? window.document.createTextNode(list[i]) : list[i]);
    }
};

// Element.prototype.matches
Element.prototype.matches =
    Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(selector) {
	if(TAG_NAME.test(selector)) {
	    return this.tagName === selector;
	}

	var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

	while (nodes[++i] && nodes[i] != node);

	return !!nodes[i];
    };

// Element.prototype.prepend
Element.prototype.prepend = Element.prototype.prepend || function() {
    var nodes = mutationMacro(arguments);
    if(this.firstChild) {
	this.insertBefore(nodes, this.firstChild);
    } else {
	this.appendChild(nodes);
    }
};

// Element.prototype.append
Element.prototype.append = Element.prototype.append || function() {
    this.appendChild(mutationMacro(arguments));
};

// Element.prototype.remove 
Element.prototype.remove = Element.prototype.remove || function() {
    if(this.parentNode) {
	this.parentNode.removeChild(this);
    }
};

// Element.prototype.replace
Element.prototype.replace = Element.prototype.replace || function() {
    if(this.parentNode) {
	this.parentNode.replaceChild(mutationMacro(arguments), this);
    }
};

// *
//     Web Components
// *

// Mutation Observer

(function(){

  // Provide unprefixed MutationObserver with native or JS implementation
  if (!window.MutationObserver && window.WebKitMutationObserver) {
    window.MutationObserver = window.WebKitMutationObserver;
    return;
  }

  if (!window.MutationObserver) {

    var registrationsTable = new WeakMap();

    // We use setImmediate or postMessage for our future callback.
    var setImmediate = window.msSetImmediate;

    // Use post message to emulate setImmediate.
    if (!setImmediate) {
      var setImmediateQueue = [];
      var sentinel = String(Math.random());
      window.addEventListener('message', function(e) {
	if (e.data === sentinel) {
	  var queue = setImmediateQueue;
	  setImmediateQueue = [];
	  queue.forEach(function(func) {
	    func();
	  });
	}
      });
      setImmediate = function(func) {
	setImmediateQueue.push(func);
	window.postMessage(sentinel, '*');
      };
    }

    // This is used to ensure that we never schedule 2 callas to setImmediate
    var isScheduled = false;

    // Keep track of observers that needs to be notified next time.
    var scheduledObservers = [];

    /**
     * Schedules |dispatchCallback| to be called in the future.
     * @param {MutationObserver} observer
     */
    function scheduleCallback(observer) {
      scheduledObservers.push(observer);
      if (!isScheduled) {
	isScheduled = true;
	setImmediate(dispatchCallbacks);
      }
    }

    function wrapIfNeeded(node) {
      return window.ShadowDOMPolyfill &&
	  window.ShadowDOMPolyfill.wrapIfNeeded(node) ||
	  node;
    }

    function dispatchCallbacks() {
      // http://dom.spec.whatwg.org/#mutation-observers

      isScheduled = false; // Used to allow a new setImmediate call above.

      var observers = scheduledObservers;
      scheduledObservers = [];
      // Sort observers based on their creation UID (incremental).
      observers.sort(function(o1, o2) {
	return o1.uid_ - o2.uid_;
      });

      var anyNonEmpty = false;
      observers.forEach(function(observer) {

	// 2.1, 2.2
	var queue = observer.takeRecords();
	// 2.3. Remove all transient registered observers whose observer is mo.
	removeTransientObserversFor(observer);

	// 2.4
	if (queue.length) {
	  observer.callback_(queue, observer);
	  anyNonEmpty = true;
	}
      });

      // 3.
      if (anyNonEmpty)
	dispatchCallbacks();
    }

    function removeTransientObserversFor(observer) {
      observer.nodes_.forEach(function(node) {
	var registrations = registrationsTable.get(node);
	if (!registrations)
	  return;
	registrations.forEach(function(registration) {
	  if (registration.observer === observer)
	    registration.removeTransientObservers();
	});
      });
    }

    /**
     * This function is used for the "For each registered observer observer (with
     * observer's options as options) in target's list of registered observers,
     * run these substeps:" and the "For each ancestor ancestor of target, and for
     * each registered observer observer (with options options) in ancestor's list
     * of registered observers, run these substeps:" part of the algorithms. The
     * |options.subtree| is checked to ensure that the callback is called
     * correctly.
     *
     * @param {Node} target
     * @param {function(MutationObserverInit):MutationRecord} callback
     */
    function forEachAncestorAndObserverEnqueueRecord(target, callback) {
      for (var node = target; node; node = node.parentNode) {
	var registrations = registrationsTable.get(node);

	if (registrations) {
	  for (var j = 0; j < registrations.length; j++) {
	    var registration = registrations[j];
	    var options = registration.options;

	    // Only target ignores subtree.
	    if (node !== target && !options.subtree)
	      continue;

	    var record = callback(options);
	    if (record)
	      registration.enqueue(record);
	  }
	}
      }
    }

    var uidCounter = 0;

    /**
     * The class that maps to the DOM MutationObserver interface.
     * @param {Function} callback.
     * @constructor
     */
    function MutationObserverPolyfill(callback) {
      this.callback_ = callback;
      this.nodes_ = [];
      this.records_ = [];
      this.uid_ = ++uidCounter;
    }

    MutationObserverPolyfill.prototype = {
      observe: function(target, options) {
	target = wrapIfNeeded(target);

	// 1.1
	if (!options.childList && !options.attributes && !options.characterData ||

	    // 1.2
	    options.attributeOldValue && !options.attributes ||

	    // 1.3
	    options.attributeFilter && options.attributeFilter.length &&
		!options.attributes ||

	    // 1.4
	    options.characterDataOldValue && !options.characterData) {

	  throw new SyntaxError();
	}

	var registrations = registrationsTable.get(target);
	if (!registrations)
	  registrationsTable.set(target, registrations = []);

	// 2
	// If target's list of registered observers already includes a registered
	// observer associated with the context object, replace that registered
	// observer's options with options.
	var registration;
	for (var i = 0; i < registrations.length; i++) {
	  if (registrations[i].observer === this) {
	    registration = registrations[i];
	    registration.removeListeners();
	    registration.options = options;
	    break;
	  }
	}

	// 3.
	// Otherwise, add a new registered observer to target's list of registered
	// observers with the context object as the observer and options as the
	// options, and add target to context object's list of nodes on which it
	// is registered.
	if (!registration) {
	  registration = new Registration(this, target, options);
	  registrations.push(registration);
	  this.nodes_.push(target);
	}

	registration.addListeners();
      },

      disconnect: function() {
	this.nodes_.forEach(function(node) {
	  var registrations = registrationsTable.get(node);
	  for (var i = 0; i < registrations.length; i++) {
	    var registration = registrations[i];
	    if (registration.observer === this) {
	      registration.removeListeners();
	      registrations.splice(i, 1);
	      // Each node can only have one registered observer associated with
	      // this observer.
	      break;
	    }
	  }
	}, this);
	this.records_ = [];
      },

      takeRecords: function() {
	var copyOfRecords = this.records_;
	this.records_ = [];
	return copyOfRecords;
      }
    };

    /**
     * @param {string} type
     * @param {Node} target
     * @constructor
     */
    function MutationRecord(type, target) {
      this.type = type;
      this.target = target;
      this.addedNodes = [];
      this.removedNodes = [];
      this.previousSibling = null;
      this.nextSibling = null;
      this.attributeName = null;
      this.attributeNamespace = null;
      this.oldValue = null;
    }

    function copyMutationRecord(original) {
      var record = new MutationRecord(original.type, original.target);
      record.addedNodes = original.addedNodes.slice();
      record.removedNodes = original.removedNodes.slice();
      record.previousSibling = original.previousSibling;
      record.nextSibling = original.nextSibling;
      record.attributeName = original.attributeName;
      record.attributeNamespace = original.attributeNamespace;
      record.oldValue = original.oldValue;
      return record;
    }

    // We keep track of the two (possibly one) records used in a single mutation.
    var currentRecord, recordWithOldValue;

    /**
     * Creates a record without |oldValue| and caches it as |currentRecord| for
     * later use.
     * @param {string} oldValue
     * @return {MutationRecord}
     */
    function getRecord(type, target) {
      return currentRecord = new MutationRecord(type, target);
    }

    /**
     * Gets or creates a record with |oldValue| based in the |currentRecord|
     * @param {string} oldValue
     * @return {MutationRecord}
     */
    function getRecordWithOldValue(oldValue) {
      if (recordWithOldValue)
	return recordWithOldValue;
      recordWithOldValue = copyMutationRecord(currentRecord);
      recordWithOldValue.oldValue = oldValue;
      return recordWithOldValue;
    }

    function clearRecords() {
      currentRecord = recordWithOldValue = undefined;
    }

    /**
     * @param {MutationRecord} record
     * @return {boolean} Whether the record represents a record from the current
     * mutation event.
     */
    function recordRepresentsCurrentMutation(record) {
      return record === recordWithOldValue || record === currentRecord;
    }

    /**
     * Selects which record, if any, to replace the last record in the queue.
     * This returns |null| if no record should be replaced.
     *
     * @param {MutationRecord} lastRecord
     * @param {MutationRecord} newRecord
     * @param {MutationRecord}
     */
    function selectRecord(lastRecord, newRecord) {
      if (lastRecord === newRecord)
	return lastRecord;

      // Check if the the record we are adding represents the same record. If
      // so, we keep the one with the oldValue in it.
      if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord))
	return recordWithOldValue;

      return null;
    }

    /**
     * Class used to represent a registered observer.
     * @param {MutationObserver} observer
     * @param {Node} target
     * @param {MutationObserverInit} options
     * @constructor
     */
    function Registration(observer, target, options) {
      this.observer = observer;
      this.target = target;
      this.options = options;
      this.transientObservedNodes = [];
    }

    Registration.prototype = {
      enqueue: function(record) {
	var records = this.observer.records_;
	var length = records.length;

	// There are cases where we replace the last record with the new record.
	// For example if the record represents the same mutation we need to use
	// the one with the oldValue. If we get same record (this can happen as we
	// walk up the tree) we ignore the new record.
	if (records.length > 0) {
	  var lastRecord = records[length - 1];
	  var recordToReplaceLast = selectRecord(lastRecord, record);
	  if (recordToReplaceLast) {
	    records[length - 1] = recordToReplaceLast;
	    return;
	  }
	} else {
	  scheduleCallback(this.observer);
	}

	records[length] = record;
      },

      addListeners: function() {
	this.addListeners_(this.target);
      },

      addListeners_: function(node) {
	var options = this.options;
	if (options.attributes)
	  node.addEventListener('DOMAttrModified', this, true);

	if (options.characterData)
	  node.addEventListener('DOMCharacterDataModified', this, true);

	if (options.childList)
	  node.addEventListener('DOMNodeInserted', this, true);

	if (options.childList || options.subtree)
	  node.addEventListener('DOMNodeRemoved', this, true);
      },

      removeListeners: function() {
	this.removeListeners_(this.target);
      },

      removeListeners_: function(node) {
	var options = this.options;
	if (options.attributes)
	  node.removeEventListener('DOMAttrModified', this, true);

	if (options.characterData)
	  node.removeEventListener('DOMCharacterDataModified', this, true);

	if (options.childList)
	  node.removeEventListener('DOMNodeInserted', this, true);

	if (options.childList || options.subtree)
	  node.removeEventListener('DOMNodeRemoved', this, true);
      },

      /**
       * Adds a transient observer on node. The transient observer gets removed
       * next time we deliver the change records.
       * @param {Node} node
       */
      addTransientObserver: function(node) {
	// Don't add transient observers on the target itself. We already have all
	// the required listeners set up on the target.
	if (node === this.target)
	  return;

	this.addListeners_(node);
	this.transientObservedNodes.push(node);
	var registrations = registrationsTable.get(node);
	if (!registrations)
	  registrationsTable.set(node, registrations = []);

	// We know that registrations does not contain this because we already
	// checked if node === this.target.
	registrations.push(this);
      },

      removeTransientObservers: function() {
	var transientObservedNodes = this.transientObservedNodes;
	this.transientObservedNodes = [];

	transientObservedNodes.forEach(function(node) {
	  // Transient observers are never added to the target.
	  this.removeListeners_(node);

	  var registrations = registrationsTable.get(node);
	  for (var i = 0; i < registrations.length; i++) {
	    if (registrations[i] === this) {
	      registrations.splice(i, 1);
	      // Each node can only have one registered observer associated with
	      // this observer.
	      break;
	    }
	  }
	}, this);
      },

      handleEvent: function(e) {
	// Stop propagation since we are managing the propagation manually.
	// This means that other mutation events on the page will not work
	// correctly but that is by design.
	e.stopImmediatePropagation();

	switch (e.type) {
	  case 'DOMAttrModified':
	    // http://dom.spec.whatwg.org/#concept-mo-queue-attributes

	    var name = e.attrName;
	    var namespace = e.relatedNode.namespaceURI;
	    var target = e.target;

	    // 1.
	    var record = new getRecord('attributes', target);
	    record.attributeName = name;
	    record.attributeNamespace = namespace;

	    // 2.
	    var oldValue =
		e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;

	    forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	      // 3.1, 4.2
	      if (!options.attributes)
		return;

	      // 3.2, 4.3
	      if (options.attributeFilter && options.attributeFilter.length &&
		  options.attributeFilter.indexOf(name) === -1 &&
		  options.attributeFilter.indexOf(namespace) === -1) {
		return;
	      }
	      // 3.3, 4.4
	      if (options.attributeOldValue)
		return getRecordWithOldValue(oldValue);

	      // 3.4, 4.5
	      return record;
	    });

	    break;

	  case 'DOMCharacterDataModified':
	    // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
	    var target = e.target;

	    // 1.
	    var record = getRecord('characterData', target);

	    // 2.
	    var oldValue = e.prevValue;


	    forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	      // 3.1, 4.2
	      if (!options.characterData)
		return;

	      // 3.2, 4.3
	      if (options.characterDataOldValue)
		return getRecordWithOldValue(oldValue);

	      // 3.3, 4.4
	      return record;
	    });

	    break;

	  case 'DOMNodeRemoved':
	    this.addTransientObserver(e.target);
	    // Fall through.
	  case 'DOMNodeInserted':
	    // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
	    var target = e.relatedNode;
	    var changedNode = e.target;
	    var addedNodes, removedNodes;
	    if (e.type === 'DOMNodeInserted') {
	      addedNodes = [changedNode];
	      removedNodes = [];
	    } else {

	      addedNodes = [];
	      removedNodes = [changedNode];
	    }
	    var previousSibling = changedNode.previousSibling;
	    var nextSibling = changedNode.nextSibling;

	    // 1.
	    var record = getRecord('childList', target);
	    record.addedNodes = addedNodes;
	    record.removedNodes = removedNodes;
	    record.previousSibling = previousSibling;
	    record.nextSibling = nextSibling;

	    forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	      // 2.1, 3.2
	      if (!options.childList)
		return;

	      // 2.2, 3.3
	      return record;
	    });

	}

	clearRecords();
      }
    };

    window.MutationObserverPolyfill = MutationObserverPolyfill;
    window.MutationObserver = MutationObserverPolyfill;

  }

})();

// Custom Element
var scope = {};
scope.logFlags = {dom:false};

if(!document.register) {
    var register = function(name, options) {
	var definition = options || {};

	if (!name) {
	    throw new Error('document.register: first argument `name` must not be empty');
	}
	if (name.indexOf('-') < 0) {
	    throw new Error('document.register: first argument (\'name\') must contain a dash (\'-\'). Argument provided was \'' + String(name) + '\'.');
	}
	// elements may only be registered once
	if (getRegisteredDefinition(name)) {
	    throw new Error('DuplicateDefinitionError: a type with name \'' + String(name) + '\' is already registered');
	}
	// must have a prototype, default to an extension of HTMLElement
	// TODO(sjmiles): probably should throw if no prototype, check spec
	if (!definition.prototype) {
	    throw new Error('Options missing required prototype property');
	}

	definition.name = name.toLowerCase();
	definition.lifecycle = definition.lifecycle || {};
	definition.ancestry = ancestry(definition['extends']);
	// extensions of native specializations of HTMLElement require localName
	// to remain native, and use secondary 'is' specifier for extension type
	resolveTagName(definition);
	// some platforms require modifications to the user-supplied prototype
	// chain
	resolvePrototypeChain(definition);
	// overrides to implement attributeChanged callback
	overrideAttributeApi(definition.prototype);
	// 7.1.5: Register the DEFINITION with DOCUMENT
	registerDefinition(definition.name, definition);
	// 7.1.7. Run custom element constructor generation algorithm with PROTOTYPE
	// 7.1.8. Return the output of the previous step.
	definition.ctor = generateConstructor(definition);
	definition.ctor.prototype = definition.prototype;
	// force our .constructor to be our actual constructor
	definition.prototype.constructor = definition.ctor;
	// if initial parsing is complete
	scope.addedNode(document);
	return definition.ctor;
    };

    var ancestry = function ancestry(extnds) {
	var extendee = getRegisteredDefinition(extnds);
	if (extendee) {
	    return ancestry(extendee['extends']).concat([extendee]);
	}
	return [];
    };

    var resolveTagName = function(definition) {
	// if we are explicitly extending something, that thing is our
	// baseTag, unless it represents a custom component
	var baseTag = definition['extends'];
	// if our ancestry includes custom components, we only have a
	// baseTag if one of them does
	for (var i=0, a; (a=definition.ancestry[i]); i++) {
	    baseTag = a.is && a.tag;
	}
	// our tag is our baseTag, if it exists, and otherwise just our name
	definition.tag = baseTag || definition.name;
	if (baseTag) {
	    // if there is a base tag, use secondary 'is' specifier
	    definition.is = definition.name;
	}
    };

    var resolvePrototypeChain = function(definition) {
	// if we don't support __proto__ we need to locate the native level
	// prototype for precise mixing in
	if (!Object.__proto__) {
	    // default prototype
	    var nativePrototype = HTMLElement.prototype;
	    // work out prototype when using type-extension
	    if (definition.is) {
		var inst = document.createElement(definition.tag);
		nativePrototype = Object.getPrototypeOf(inst);
	    }
	    // ensure __proto__ reference is installed at each point on the prototype
	    // chain.
	    // NOTE: On platforms without __proto__, a mixin strategy is used instead
	    // of prototype swizzling. In this case, this generated __proto__ provides
	    // limited support for prototype traversal.
	    var proto = definition.prototype, ancestor;
	    while (proto && (proto !== nativePrototype)) {
		var ancestor = Object.getPrototypeOf(proto);
		proto.__proto__ = ancestor;
		proto = ancestor;
	    }
	}
	// cache this in case of mixin
	definition['native'] = nativePrototype;
    };

    // SECTION 4

    function instantiate(definition) {
	// 4.a.1. Create a new object that implements PROTOTYPE
	// 4.a.2. Let ELEMENT by this new object
	//
	// the custom element instantiation algorithm must also ensure that the
	// output is a valid DOM element with the proper wrapper in place.
	//
	return upgrade(domCreateElement(definition.tag), definition);
    }

    function upgrade(element, definition) {
	// some definitions specify an 'is' attribute
	if (definition.is) {
	    element.setAttribute('is', definition.is);
	}
	// remove 'unresolved' attr, which is a standin for :unresolved.
	element.removeAttribute('unresolved');
	// make 'element' implement definition.prototype
	implement(element, definition);
	// flag as upgraded
	element.__upgraded__ = true;
	// there should never be a shadow root on element at this point
	// we require child nodes be upgraded before `created`
	scope.addedSubtree(element);
	// lifecycle management
	created(element);
	// OUTPUT
	return element;
    }

    function implement(element, definition) {
	// prototype swizzling is best
	if (Object.__proto__) {
	    element.__proto__ = definition.prototype;
	} else {
	    // where above we can re-acquire inPrototype via
	    // getPrototypeOf(Element), we cannot do so when
	    // we use mixin, so we install a magic reference
	    customMixin(element, definition.prototype, definition['native']);
	    element.__proto__ = definition.prototype;
	}
    }

    function customMixin(inTarget, inSrc, inNative) {
	// TODO(sjmiles): 'used' allows us to only copy the 'youngest' version of
	// any property. This set should be precalculated. We also need to
	// consider this for supporting 'super'.
	var used = {};
	// start with inSrc
	var p = inSrc;
	// sometimes the default is HTMLUnknownElement.prototype instead of
	// HTMLElement.prototype, so we add a test
	// the idea is to avoid mixing in native prototypes, so adding
	// the second test is WLOG
	while (p !== inNative && p !== HTMLUnknownElement.prototype) {
	    var keys = Object.getOwnPropertyNames(p);
	    for (var i=0, k; k=keys[i]; i++) {
		if (!used[k]) {
		    Object.defineProperty(inTarget, k,
					  Object.getOwnPropertyDescriptor(p, k));
		    used[k] = 1;
		}
	    }
	    p = Object.getPrototypeOf(p);
	}
    }

    function created(element) {
	// invoke createdCallback
	if (element.createdCallback) {
	    element.createdCallback();
	}
    }

    // attribute watching

    function overrideAttributeApi(prototype) {
	// overrides to implement callbacks
	// TODO(sjmiles): should support access via .attributes NamedNodeMap
	// TODO(sjmiles): preserves user defined overrides, if any
	if (prototype.setAttribute._polyfilled) {
	    return;
	}
	var setAttribute = prototype.setAttribute;
	prototype.setAttribute = function(name, value) {
	    changeAttribute.call(this, name, value, setAttribute);
	}
	var removeAttribute = prototype.removeAttribute;
	prototype.removeAttribute = function(name) {
	    changeAttribute.call(this, name, null, removeAttribute);
	}
	prototype.setAttribute._polyfilled = true;
    }

    // https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/
    // index.html#dfn-attribute-changed-callback
    function changeAttribute(name, value, operation) {
	var oldValue = this.getAttribute(name);
	operation.apply(this, arguments);
	var newValue = this.getAttribute(name);
	if (this.attributeChangedCallback
	    && (newValue !== oldValue)) {
	    this.attributeChangedCallback(name, oldValue, newValue);
	}
    }

    // element registry (maps tag names to definitions)

    var registry = {};
    scope.registry = registry;

    function getRegisteredDefinition(name) {
	if (name) {
	    return registry[name.toLowerCase()];
	}
    }

    function registerDefinition(name, definition) {
	registry[name] = definition;
    }

    function generateConstructor(definition) {
	return function() {
	    return instantiate(definition);
	};
    }

    function createElement(tag, typeExtension) {
	// TODO(sjmiles): ignore 'tag' when using 'typeExtension', we could
	// error check it, or perhaps there should only ever be one argument
	var definition = getRegisteredDefinition(typeExtension || tag);
	if (definition) {
	    return new definition.ctor();
	}
	return domCreateElement(tag);
    }

    function upgradeElement(element) {
	if (!element.__upgraded__ && (element.nodeType === Node.ELEMENT_NODE)) {
	    var type = element.getAttribute('is') || element.localName;
	    var definition = getRegisteredDefinition(type);
	    return definition && upgrade(element, definition);
	}
    }

    function cloneNode(deep) {
	// call original clone
	var n = domCloneNode.call(this, deep);
	// upgrade the element and subtree
	addedNode(n);
	// return the clone
	return n;
    }
    // capture native createElement before we override it

    var domCreateElement = document.createElement.bind(document);

    // capture native cloneNode before we override it

    var domCloneNode = Node.prototype.cloneNode;

    // exports

    document.register = register;
    document.createElement = createElement; // override
    Node.prototype.cloneNode = cloneNode; // override
    scope.upgradeElement = upgradeElement;


    (function(scope){

	var logFlags = scope.logFlags;

	/*
	  Copyright 2013 The Polymer Authors. All rights reserved.
	  Use of this source code is governed by a BSD-style
	  license that can be found in the LICENSE file.
	*/

	// walk the subtree rooted at node, applying 'find(element, data)' function
	// to each element
	// if 'find' returns true for 'element', do not search element's subtree
	function findAll(node, find, data) {
	    var e = node.firstElementChild;
	    if (!e) {
		e = node.firstChild;
		while (e && e.nodeType !== Node.ELEMENT_NODE) {
		    e = e.nextSibling;
		}
	    }
	    while (e) {
		if (find(e, data) !== true) {
		    findAll(e, find, data);
		}
		e = e.nextElementSibling;
	    }
	    return null;
	}

	// walk the subtree rooted at node, including descent into shadow-roots,
	// applying 'cb' to each element
	function forSubtree(node, cb) {
	    //logFlags.dom && node.childNodes && node.childNodes.length && console.group('subTree: ', node);
	    findAll(node, function(e) {
		if (cb(e)) {
		    return true;
		}
	    });
	    //logFlags.dom && node.childNodes && node.childNodes.length && console.groupEnd();
	}

	// manage lifecycle on added node
	function added(node) {
	    if (upgrade(node)) {
		insertedNode(node);
		return true;
	    }
	    inserted(node);
	}

	// manage lifecycle on added node's subtree only
	function addedSubtree(node) {
	    forSubtree(node, function(e) {
		if (added(e)) {
		    return true;
		}
	    });
	}

	// manage lifecycle on added node and it's subtree
	function addedNode(node) {
	    return added(node) || addedSubtree(node);
	}

	// upgrade custom elements at node, if applicable
	function upgrade(node) {
	    if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
		var type = node.getAttribute('is') || node.localName;
		var definition = scope.registry[type];
		if (definition) {
		    logFlags.dom && console.group('upgrade:', node.localName);
		    scope.upgradeElement(node);
		    logFlags.dom && console.groupEnd();
		    return true;
		}
	    }
	}

	function insertedNode(node) {
	    inserted(node);
	    if (inDocument(node)) {
		forSubtree(node, function(e) {
		    inserted(e);
		});
	    }
	}

	// TODO(sorvell): on platforms without MutationObserver, mutations may not be
	// reliable and therefore entered/leftView are not reliable.
	// To make these callbacks less likely to fail, we defer all inserts and removes
	// to give a chance for elements to be inserted into dom.
	// This ensures enteredViewCallback fires for elements that are created and
	// immediately added to dom.
	var hasPolyfillMutations = (window.MutationObserver === window.MutationObserverPolyfill);

	var isPendingMutations = false;
	var pendingMutations = [];
	function deferMutation(fn) {
	    pendingMutations.push(fn);
	    if (!isPendingMutations) {
		isPendingMutations = true;
		var async = (window.Platform && window.Platform.endOfMicrotask) ||
		    setTimeout;
		async(takeMutations);
	    }
	}

	function takeMutations() {
	    isPendingMutations = false;
	    var $p = pendingMutations;
	    for (var i=0, l=$p.length, p; (i<l) && (p=$p[i]); i++) {
		p();
	    }
	    pendingMutations = [];
	}

	function inserted(element) {
	    if (hasPolyfillMutations) {
		deferMutation(function() {
		    _inserted(element);
		});
	    } else {
		_inserted(element);
	    }
	}

	// TODO(sjmiles): if there are descents into trees that can never have inDocument(*) true, fix this
	function _inserted(element) {
	    // TODO(sjmiles): it's possible we were inserted and removed in the space
	    // of one microtask, in which case we won't be 'inDocument' here
	    // But there are other cases where we are testing for inserted without
	    // specific knowledge of mutations, and must test 'inDocument' to determine
	    // whether to call inserted
	    // If we can factor these cases into separate code paths we can have
	    // better diagnostics.
	    // TODO(sjmiles): when logging, do work on all custom elements so we can
	    // track behavior even when callbacks not defined
	    //console.log('inserted: ', element.localName);
	    if (element.enteredViewCallback || (element.__upgraded__ && logFlags.dom)) {
		logFlags.dom && console.group('inserted:', element.localName);
		if (inDocument(element)) {
		    element.__inserted = (element.__inserted || 0) + 1;
		    // if we are in a 'removed' state, bluntly adjust to an 'inserted' state
		    if (element.__inserted < 1) {
			element.__inserted = 1;
		    }
		    // if we are 'over inserted', squelch the callback
		    if (element.__inserted > 1) {
			logFlags.dom && console.warn('inserted:', element.localName,
						     'insert/remove count:', element.__inserted)
		    } else if (element.enteredViewCallback) {
			logFlags.dom && console.log('inserted:', element.localName);
			element.enteredViewCallback();
		    }
		}
		logFlags.dom && console.groupEnd();
	    }
	}

	function removedNode(node) {
	    removed(node);
	    forSubtree(node, function(e) {
		removed(e);
	    });
	}

	function removed(element) {
	    if (hasPolyfillMutations) {
		deferMutation(function() {
		    _removed(element);
		});
	    } else {
		_removed(element);
	    }
	}

	function _removed(element) {
	    // TODO(sjmiles): temporary: do work on all custom elements so we can track
	    // behavior even when callbacks not defined
	    if (element.leftViewCallback || (element.__upgraded__ && logFlags.dom)) {
		logFlags.dom && console.log('removed:', element.localName);
		if (!inDocument(element)) {
		    element.__inserted = (element.__inserted || 0) - 1;
		    // if we are in a 'inserted' state, bluntly adjust to an 'removed' state
		    if (element.__inserted > 0) {
			element.__inserted = 0;
		    }
		    // if we are 'over removed', squelch the callback
		    if (element.__inserted < 0) {
			logFlags.dom && console.warn('removed:', element.localName,
						     'insert/remove count:', element.__inserted)
		    } else if (element.leftViewCallback) {
			element.leftViewCallback();
		    }
		}
	    }
	}

	function inDocument(element) {
	    var p = element;
	    var doc = document;
	    while (p) {
		if (p == doc) {
		    return true;
		}
		p = p.parentNode || p.host;
	    }
	}

	function handler(mutations) {
	    //
	    if (logFlags.dom) {
		var mx = mutations[0];
		if (mx && mx.type === 'childList' && mx.addedNodes) {
		    if (mx.addedNodes) {
			var d = mx.addedNodes[0];
			while (d && d !== document && !d.host) {
			    d = d.parentNode;
			}
			var u = d && (d.URL || d._URL || (d.host && d.host.localName)) || '';
			u = u.split('/?').shift().split('/').pop();
		    }
		}
		console.group('mutations (%d) [%s]', mutations.length, u || '');
	    }
	    //
	    mutations.forEach(function(mx) {
		//logFlags.dom && console.group('mutation');
		if (mx.type === 'childList') {
		    forEach(mx.addedNodes, function(n) {
			//logFlags.dom && console.log(n.localName);
			if (!n.localName) {
			    return;
			}
			// nodes added may need lifecycle management
			addedNode(n);
		    });
		    // removed nodes may need lifecycle management
		    forEach(mx.removedNodes, function(n) {
			//logFlags.dom && console.log(n.localName);
			if (!n.localName) {
			    return;
			}
			removedNode(n);
		    });
		}
		//logFlags.dom && console.groupEnd();
	    });
	    logFlags.dom && console.groupEnd();
	};

	var observer = new MutationObserver(handler);

	var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

	function observeDocument() {
	    observer.observe(document, {childList: true, subtree: true});
	}

	function upgradeDocument() {
	    logFlags.dom && console.group('upgradeDocument: ', (document.URL || document._URL || '').split('/').pop());
	    addedNode(document);
	    logFlags.dom && console.groupEnd();
	}

	// export
	scope.addedNode = addedNode;
	window.addedNode = addedNode;
	scope.addedSubtree = addedSubtree;

	/*
	 * Copyright 2013 The Polymer Authors. All rights reserved.
	 * Use of this source code is governed by a BSD-style
	 * license that can be found in the LICENSE file.
	 */
	// observe document for dom changes
	observeDocument();

	window.addEventListener('DOMContentLoaded', function() {
	    upgradeDocument();
	});
    })(scope);
};

/*
window.ES = {};

window.ES.BlockElement = class extends HTMLDivElement {
    get parent() {
	return this.parentNode;
    }
    get height() {
	return this.style.height;
    }
    set height(length) {
	this.style.height = length;
    }
    get width() {
	return this.style.width;
    }
    set width(length) {
	this.style.width = length;
    }
    append(el) {
	this.appendChild(el);
    }
    attr(key, value) {
	 if(value === undefined) {
	 return this.getAttribute(key) || undefined;
	 } else {
	 this.setAttribute(key, value);
	 }
    }
};
*/

Element.prototype.hide = function(duration) {
    if(duration) {
	setTimeout(() => this.style.display = "none");
    } else {
	this.style.display = "none";
    }
};

const FRAME_RATE = 10;

var toBold = function(el) {
    var before = el.value.splice(0, el.selectionStart);
    var selection = el.value.splice(el.selectionStart, el.selectionEnd).replace(/<b>/, "").replace(/<b\/>/, "");
    var after = el.value.splice(el.selectionEnd);
    if(before.indexOf("<b/>") > before.indexOf("<b>")) {
	selection = "<b>" + selection;
    }
    if(after.indexOf("<b>") > after.indexOf("<b/>")) {
	selection += "<b/>";
    }
    return before + selection + after;
}

Element.prototype.slideDown = function(duration=500) {
    var simulacrum = this.cloneNode(true);
    simulacrum.style.height = "auto";
    simulacrum.style.display = "block";
    simulacrum.style.visibility = "hidden";
    simulacrum.style.position = "absolute";
    simulacrum.style.left = "-9999px";
    this.parentNode.insertBefore(simulacrum, this);
    const finalHeight = simulacrum.clientHeight;
    const heightIncrement = finalHeight / (duration / FRAME_RATE);
    simulacrum.remove();
    var originalOverflow = this.style.overflow;
    this.style.height = "0px";
    this.style.display = "block";
    this.style.visibility = "visibile";
    this.style.overflow = "hidden";
    var y = 0;
    var tween = () => {
	y += heightIncrement;
	this.style.height = y + "px";
	if (y < finalHeight) {
	    setTimeout(tween, FRAME_RATE);
	} else {
	    this.style.height = "auto";
	    this.style.overflow = originalOverflow;
	}
    };
    tween();
};

NodeList.prototype.forEach = HTMLCollection.prototype.forEach = function(cb) {
    for(var i = 0; i < this.length; i++) {
	cb(this[i], i);
    }
};
