---
title: Priorities
layout: default
category: Infusion
---

Many elements of an Infusion application (in particular, [Listeners](InfusionEventSystem.md#registering-a-listener-to-an-event),
[Model Listeners](ChangeApplierAPI.md#model-listener-declaration), [Options Distributions](IoCSS.md) and [Subcomponents](SubcomponentDeclaration.md))
accept a standardised entry named ``priority`` which allows the position of that element within a list of similar elements to be adjusted.
Depending on what the element is, the effect of the priority will be different &#8212; for example, a listener may be notified earlier or later than another
listener, or a set of options or grades may take priority over another during options merging.

The priority system is designed to be "open" in the face of evolving application designs that are worked on by different groups. As well as standard
fixed priorities (represented by numbers or _extremal values_ such as `"first"` or `"last"`), Infusion priorities may be _constraint-based_ in which
an element defines its priority only with respect to another element which is identified by _namespace_. The syntax and idiom for namespaces follows that for
[event listeners](InfusionEventSystem.md#registering-a-listener-to-an-event). These constraint-based priorities are
much less brittle than the use of fixed priorities, and are recommended whenever a priority directive seems to be required.

## Supported values for priorities ##

<table>
  <thead>
    <tr>
      <td>Type</td>
      <td>Description</td>
      <td>Examples</td>
    </tr>
  </thead>
<tr><td>Numeric</td>
<td>An <em>integer value</em> representing a fixed priority (not generally recommended). In general, higher numbers represent "greater priority" with whatever meaning
that takes in the relevant context. For example, a listener with higher priority will fire before one with a lower priority, or options with higher priority
will merge on top of options with a lower priority</td><td>1, 10, 100</td></tr>

<tr><td>Constraint</td>
<td>Either of the strings <code>before</code> or <code>after</code> followed by the <code>namespace</code> of some other element (the "target element") of the same type, separated by a colon.
The framework will sort all the elements in the same set so that this element will be placed immediately before or after the target element,
unless a further constraint positions a third listener in between them.</td><td><code>"before:bindMarkup"</code>, <code>"after:computeLayout"</code></td></tr>

<tr><td>Extremal Priority</td>
<td>Either of the strings <code>first</code> or <code>last</code>, either by themselves, or followed by an <strong>extremal priority class</strong> (currently supported values <code>testing</code> and <code>authoring</code>) separated by a colon. Elements annotated <code>first</code> or
<code>last</code> will sort either before or after all those which have been given finite numerical priorities (although a constraint-based priority will always have its directive honoured, even if
it involves being situated beyond an element with extremal priority). If the string is followed by <code>:class</code> for one of the supported classes, this increases the "level of infinity" that the priority
represents to that of the class, so that it will beat any extremal priority of a lower class or an unqualified extremal priority. The currently supported extremal priority classes are <code>testing</code> and <code>authoring</code>.
So, an element listed <code>last:authoring</code> will beat an element listed <code>last:testing</code>, which will beat any element merely listed as <code>last</code>.</td>
<td><code>"last"</code>, <code>"last:testing"</code></td>
</table>

Note that the framework's algorithm for sorting by priority uses a [stable sorting algorithm](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability) so that in the absence of any priorities, any
original ordering of the elements will be preserved. Elements without any priority will sort close to those which have been specified with an explicit numeric priority of 0, whilst retaining any original relative ordering.
In the case of event listeners, this will be significant since it will respect any procedural order of addition, as well as any order
resulting from grade merging. For options distributions, the natural ordering will be derived instead from the tree's topology (distributions which travelled a longer distance will
be weaker than those which travelled a shorter distance), and numeric priorities should not be used.

## Example of priority resolution for listeners ##

Here is part of a grade definition from the framework's Uploader component implementation, showing a recommended use of a constraint-based priority:

```javascript
fluid.defaults("fluid.uploader.errorPanel.section", {
    gradeNames: ["fluid.viewComponent"],
...
    listeners: {
        "onCreate.bindHandlers": {
            funcName: "fluid.uploader.errorPanel.section.bindHandlers",
            priority: "before:refreshView"
        },
        "onCreate.refreshView": "{that}.refreshView"
    }
});
```

Amongst the two `onCreate` listeners, the framework guarantees that the `bindHandlers` listener will always be invoked before `refreshView`.

## Table of supported sites for priorities and namespaces ##

The following table lists all the locations in component options where priorities are supported, together with some notes about their limitations and interpretation.

<table>
  <thead>
    <tr>
      <td>Options Record Entry</td>
      <td>Polarity</td>
      <td>Notes</td>
    </tr>
  </thead>
  <tr>
  <td><a href="InfusionEventSystem.md#registering-a-listener-to-an-event"><code>listeners</code></a></td>
  <td>Lower numeric numbers, <code>last</code>, and <code>after</code> will fire later than others</td>
  <td>Full support for constraints, listeners uniquified based on <code>namespace</code></td>
  </tr>

  <tr><td><a href="ChangeApplierAPI.md#model-listener-declaration"><code>modelListeners</code></a></td>
  <td>Ordering as for <code>listeners</code>. Model listeners will be sorted globally across the entire <a href="ModelRelay.md">model skeleton</a> by priority when a transaction concludes.</td>
  <td>Full support for constraints, model listeners uniquified based on <code>namespace</code></td></tr>

  <tr><td><a href="ModelRelay.md#explicit-model-relay-style"><code>modelRelay</code></a></td>
  <td>Ordering as for <code>listeners</code>. Model relay rules will be sorted locally at the point of responding to a model change within a <a href="ModelRelay.md">transaction</a>.
      Note that the same model relay rule(s) may operate multiple times within a transaction.</td>
  <td>Full support for constraints, model relay rules uniquified based on <code>namespace</code></td></tr>

  <tr><td><a href="IoCSS.md"><code>distributeOptions</code></a></td>
  <td>Lower numeric numbers, <code>last</code> and <code>after</code> will appear <strong>later</strong> in the merge order (with merging considering to occur from left to right &#8212; note that this is the opposite direction in which
  parent <code>gradeNames</code> of a grade are considered), that is, these will represent <strong>stronger</strong> options that will merge on top of other options.</td>
  <td>Full support for constraints, distributions not uniquified based on <code>namespace</code> (currently). Note that priority for distributions with the priority field left blank will be determined by component tree
  topology &#8212; distributions which travel a further distance will have weaker ("earlier", "lower") priority than distributions from nearby. Numeric priorities should not be used.</td>
  </tr>

  <tr>
  <td><a href="ContextAwareness.md"><code>contextAwareness</code></a></td>
  <td>Supported in both <code>adaptationRecord</code> entries and <code>checkRecord</code> entries. In checks, lower numeric numbers, <code>last</code>, and <code>after</code> will be executed later than others. In adaptations,
  lower numeric numbers, <code>last</code>, and <code>after</code> will have their grades override those which appear before</td>
  <td>Full support for constraints, records uniquified based on <code>namespace</code></td>
  </tr>

  <tr><td><a href="SubcomponentDeclaration.md"><code>components</code></a></td>
  <td>Ordering as for <code>listeners</code>. Components with lower priority will be constructed later.</td>
  <td>Note that there is <strong>no</strong> support for <code>namespace</code> for component declarations, and hence no support for constraint-based priorities. The use of priorities for subcomponent declarations is <strong>not recommended</strong>. You should always be able
  to rely on the natural data-driven (by order of resolving IoC references) order for instantiation of components.</td>
  </tr>
</table>
