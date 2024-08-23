## Modules

<dl>
<dt><a href="#module_Accordion">Accordion</a></dt>
<dd><p>Top-level accordion wrapper</p></dd>
<dt><a href="#module_AccordionItem">AccordionItem</a></dt>
<dd><p>An item in the accordion</p></dd>
<dt><a href="#module_Callout">Callout</a></dt>
<dd><p>General callout component for displaying information, warnings, and cautions.</p></dd>
<dt><a href="#module_Sandbox">Sandbox</a></dt>
<dd><p>JavaScript Sandbox</p></dd>
<dt><a href="#module_Steps">Steps</a></dt>
<dd><p>Step-by-step instructions</p></dd>
</dl>

<a name="module_Accordion"></a>

## Accordion
<p>Top-level accordion wrapper</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | <p>The value of the accordion item to be expanded. If not provided, all items will be collapsed.</p> |
| children |  | <p>nested elements</p> |

**Example**  
```tsx
<i-accordion value="1">
	<i-accordion-item value="1" title="Item 1">
		<p>Item 1 content</p>
	</i-accordion-item>
	<i-accordion-item value="2" title="Item 2">
		<p>Item 2 content</p>
	</i-accordion-item>
</i-accordion>
```
<a name="module_AccordionItem"></a>

## AccordionItem
<p>An item in the accordion</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>The identifier for the accordion item, must be unique inside the same accordion</p> |
| title | <code>string</code> | <p>The title of the accordion item, optional. If not provided, the title will be the value.</p> |
| children |  | <p>nested elements</p> |

<a name="module_Callout"></a>

## Callout
<p>General callout component for displaying information, warnings, and cautions.</p>


| Param | Description |
| --- | --- |
| title | <p>The title of the callout, optional. If not provided, the title will be &quot;Note&quot;, &quot;Warning&quot;, or &quot;Caution&quot; based on the variant. Defaults to &quot;Note&quot;.</p> |
| variant | <p>The variant of the callout, &quot;info&quot;, &quot;warning&quot;, or &quot;danger&quot;. Defaults to &quot;info&quot;.</p> |
| children | <p>nested elements</p> |

**Example**  
```js
<i-callout variant="info">
	this is **important**
</i-callout>
```
<a name="module_Sandbox"></a>

## Sandbox
<p>JavaScript Sandbox</p>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>undefined</code> | <p>The id of the sandbox. If not provided, a random id will be generated.</p> |
| code | <code>string</code> | <p>The code to run in the sandbox</p> |

**Example**  
```js
<i-sandbox-js
	id="hello-world-example"
	code="console.log('Hello, world!');"
/>
```
<a name="module_Steps"></a>

## Steps
<p>Step-by-step instructions</p>

**Example**  
```js
<i-steps>
	#### step 1
	instructions for step 1

	#### step 2
	instructions for step 2
</i-steps>
```
