---
title: Text To Speech API
layout: default
category: Components
---

The **Text To Speech** component uses [Web Speech Synthesis API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section) to queue up and read texts.

## Browser Support ##
The Text To Speech component can be used in browsers that support [Web Speech Synthesis API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section). At the time of writing, July 26 2016, these browsers include:
* Chrome 31+
* Chrome for Android 40+
* Safari 7.1+
* iOS Safari 7.1+
* MS Edge 14 (in Preview Release)
* Firefox 48+ (using the `media.webspeech.synth.enabled` about:config option)

<div class="infusion-docs-note"><strong>Note:</strong> Find the latest browser support data for Web Speech Synthesis API from [caniuse.com](http://caniuse.com/#feat=web-speech).</div>

## Creator ##

Use the following function to create a Text To Speech component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.textToSpeech(options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiate the text to speech component. The methods of the instantiated component can be called to queue up and read texts.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>model.utteranceOpts</dt>
                    <dd>
                        An optional data structure supplied to the component model that configures the Text To Speech component behaviour, as described below. As part of the component model, can be managed through the [ChangeApplier API](ChangeApplierAPI.md) to assist in coordination with other components.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The Text To Speech component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var tts = fluid.textToSpeech({
    model: {
        utteranceOpts: {
            volume: 1
        }
    },
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
                <a href="#utteranceopts-option">`model.utteranceOpts` Options</a>
            </td>
        </tr>
    </tbody>
</table>

## Supported Methods ##

### queueSpeech ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.queueSpeech(text, interrupt, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>queueSpeech</code> method allows you to append <code>text</code> to the end of the queue to begin speaking after the other texts in the queue have been spoken. Setting the <code>interrupt</code> argument to true will remove all texts from the queue before adding <code>text</code> to the queue.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>text</dt>
                    <dd>
                        The string of text to be appended to the queue and spoken.
                    </dd>
                    <dt>interrupt</dt>
                    <dd>
                        An optional boolean value. The default value is false. Setting it to true will remove all texts from the queue before adding the text. Setting it to false will not affect previously queued texts.
                    </dd>
                    <dt>options</dt>
                    <dd>
                        An optional javascript object. Allows for the configuration of the specific <code>SpeechSynthesisUtterance</code> instance used for this particular text. The configuration passed in here takes the same form as <a href="#utteranceopts-option">`model.utteranceOpts`</a> and will override them for this instance only.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.queueSpeech("Hello world", false, {
    volume: 0.5
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### cancel ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.cancel();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>cancel</code> method allows you to remove all texts from the queue. If a text is being spoken, speaking ceases immediately.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### pause ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.pause();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>pause</code> method allows you to immediately pause any texts that are being spoken.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### resume ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.resume();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>resume</code> method allows you to resume speaking a text that was previously paused.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### getVoices ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.getVoices();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>getVoices</code> method allows you to get a list of all the voices that are supported by the browser. This list is an array of <code>SpeechSynthesisVoice</code> objects. Each of these <code>SpeechSynthesisVoice</code> objects has a number of attributes:
                <ul>
                <li>name: A human-readable name that describes the voice.</li>
                <li>voiceURI: A URI specifying the location of the speech synthesis service for this voice.</li>
                <li>lang: The language code for this voice.</li>
                <li>default: Set to true if this is the default voice used by the browser.</li>
                <li>localService: The API can use both local and remote services to handle speech synthesis. If this attribute is set to true the speech synthesis for this voice is handled by a local service. If it’s false a remote service is being used. This attribute can be useful if you’re building an app that needs to work offline. You could use a remote service when an internet connection is present, and fallback to a local service if a connection is not available.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>


## Supported Events ##

<div class="infusion-docs-note"><strong>Note:</strong> If needed, please read the [Infusion Event System](InfusionEventSystem.md) document for a full description of infusion events.</div>

The events fired by the Text To Speech component are described below.

### onStart ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when texts in the queue have begun to be spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### onStop ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the speaking stops, which occurs when all the texts in the queue have been spoken or the speaking is manually stopped.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### onPause ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the text is paused whilst being spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### onResume ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when a paused text resumes being spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### onError ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when an error occurs that prevents the text from being spoken.</em></p>
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### onSpeechQueued ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when a text has been queued up to be spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>text</dt>
                    <dd>
                        The text that has been added to the queue.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

## <a name="utteranceopts-option"></a>`model.utteranceOpts` Configuration ##

<div class="infusion-docs-note"><strong>Note:</strong> If needed, please read the [Component Configuration Options](ComponentConfigurationOptions.md) document for a full description of infusion component options.</div>

Configuration of the Text To Speech component can be done through `model.utteranceOpts`. This model path is a Javascript object that contains attributes that users can use to define the behaviour of the [SpeechSynthesisUtterance instance](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#utterance-attributes) (a part of the web speech API that the Text To Speech component interacts with).

<div class="infusion-docs-note"><strong>Note:</strong> Not all speech synthesizers support all these attributes and some may take different ranges.</div>

These attributes include:

### text ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>text</code> attribute allows you to set the text that you wish to be spoken.
                <strong>Note</strong>: Be careful with this attribute as it will override any text that was previously passed.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                ""
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    model: {
        utteranceOpts: {
            text: "Override other texts"
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### lang ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>lang</code> attribute gives you ability to specify a <a href="http://www.ietf.org/rfc/bcp/bcp47.txt">BCP 47</a> language tag indicating the language of the voice.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                Default to the language of the HTML document.
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    model: {
        utteranceOpts: {
            lang: "en-US"
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### voice ###
<!-- See the errata at https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi-errata.html - SpeechSynthesisUtterance must be passed a SpeechSynthesisVoice object to configure the voice under the latest API -->
<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>voice</code> attribute must be a <a href="https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechsynthesisvoice">`SpeechSynthesisVoice`</a> object that specifies the speech synthesis voice that the web application wishes to use. Calling the <a href="#getvoices">getVoices</a> method returns an array of all available voices, from which you can select a valid `SpeechSynthesisVoice`.               
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                Default to the user agent default speech service. It varies depending on the browser configuration.
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>

// Assuming an existing textToSpeech component
var availableVoices = textToSpeech.getVoices();
var voiceToUse = availableVoices[0];

fluid.textToSpeech({
    model: {
        utteranceOpts: {
            voice: voiceToUse
        }
    }
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
            Method <a href="#getvoices">getVoices()</a>
            </td>
        </tr>
    </tbody>
</table>

### volume ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>volume</code> attribute allows you to adjust the volume of the speech. This is a float value between 0 and 1.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    model: {
        utteranceOpts: {
            volume: 0.5
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### rate ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>rate</code> attribute allows you to define the speed at which the text should be spoken. This is a float value between 0 and 10.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    model: {
        utteranceOpts: {
            rate: 2.5
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### pitch ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>pitch</code> attribute allows you to control how high or low the text is spoken. This is a float value between 0 and 2.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    model: {
        utteranceOpts: {
            pitch: 1.2
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
