---
title: Deprecations in 1.5
layout: default
category: Infusion
---

This page contains a list of the features, API's, and etc. that were deprecated in Infusion 1.5, and removed in Infusion 2.0.

<table>
    <thead>
        <tr>
            <th>Deprecated</th>
            <th>Alternative</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>FSS</td>
            <td>
                There are no CSS Framework requirements for working with Infusion. Infusion's strategy going forward will be to use custom CSS for component specific styling and <a href="http://foundation.zurb.com/">Foundation</a> for demos, as needed.
            </td>
        </tr>
        <tr>
            <td>demands</td>
            <td>
                Use distributeOptions and/or dynamic grades instead
            </td>
        </tr>
        <tr>
            <td>grade linkage operated by the <code>fluid.applyGradeLinkage</code> grade</td>
            <td>
                Use distributeOptions and/or dynamic grades instead
            </td>
        </tr>
        <tr>
            <td>components which aren't <code>autoInit</code></td>
            <td></td>
        </tr>
        <tr>
            <td>returning non-component material from a creator functions</td>
            <td></td>
        </tr>
        <tr>
            <td>manually attaching components to trees</td>
            <td></td>
        </tr>
        <tr>
            <td>
                manual lifecycle points:
                <ul>
                    <li><code>preInit</code></li>
                    <li><code>postInit</code></li>
                    <li><code>finalInit</code></li>
                </ul>
            </td>
            <td>
                Use <code>listeners</code> and <code>modelListeners</code>
            </td>
        </tr>
        <tr>
            <td>manual component initialization (e.g. <code>fluid.initLittleComponent</code> and <code>fluid.initViewComponent</code>)</td>
            <td>
                Use grades and <code>autoInit</code>
            </td>
        </tr>
        <tr>
            <td>
                Legacy IoC expressions
                <ul>
                    <li><code>"@1"</code></li>
                    <li><code>"COMPONENT_OPTIONS"</code></li>
                    <li>etc.</li>
                </ul>
            </td>
            <td></td>
        </tr>
        <tr>
            <td><code>returnedPath</code> and <code>returnedOptions</code></td>
            <td></td>
        </tr>
        <tr>
            <td>
                <code>changeApplier</code> and <code>model</code> features
                <ul>
                    <li><code>changeApplier</code> events <code>guards</code> and <coode>postGuards</code></li>
                    <li><code>changeApplier</code> event type <code>MERGE</code></li>
                    <li><code>fluid.makeSuperApplier</code></li>
                    <li><code>fluid.model.copyModel</code></li>
                    <li>mergePolicy: <code>preserve</code></li>
                </ul>
            </td>
            <td>Use <code>fluid.copy</code> to copy models.</td>
        </tr>
        <tr>
            <td><code>fluid.tryCatch</code></td>
            <td></td>
        </tr>
        <tr>
            <td>
                Event features:
                <ul>
                    <li>
                        <code>fluid.event.getEventFier</code>
                    </li>
                    <li>
                        <code>unicast</code> events
                    </li>
                </ul>
            </td>
            <td>
                Use <code>fluid.makeEventFier</code> instead of <code>fluid.event.getEventFier</code>; however, the signature for this method may change in 2.0.
            </td>
        </tr>
        <tr>
            <td>
                Progress events and callbacks:
                <ul>
                    <li>
                        <code>onProgressBegin</code>
                    </li>
                    <li>
                        <code>afterProgressHidden</code>
                    </li>
                </ul>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>
                        <code>fluid.model.setBeanValue</code>
                    </li>
                    <li>
                        <code>fluid.model.getBeanValue</code>
                    </li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
                        <code>fluid.model.set</code>
                    </li>
                    <li>
                        <code>fluid.model.get</code>
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>fluid.lightbox</code></td>
            <td><code>fluid.imageReorderer</code></td>
        </tr>
        <tr>
            <td><code>fluid.keyForValue</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Path utilities in DataBinding.js</td>
            <td>Removed from Infusion 1.5</td>
        </tr>
        <tr>
            <td><code>fl-ProgEnhance-basic</code> class name</td>
            <td><code>fl-progEnhance-basic</code></td>
        </tr>
        <tr>
            <td>Renderer API</td>
            <td>The Renderer is likely to undergo large scale changes.</td>
        </tr>
    </tbody>
</table>
