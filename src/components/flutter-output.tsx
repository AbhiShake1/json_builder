"use client"

import { useSchemaStore } from "~/stores/schema"
import { omit } from "lodash"

type UnknownRecord = Record<string, unknown>

function toTitleCase(str: string): string {
    const replacedStr = str.replace(/[-_]/g, ' ');
    const words = replacedStr.split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

const dartType = {
  string: 'String',
  object: 'Map',
  boolean: 'bool',
  array: 'List',
  integer: 'int',
  number: 'double',
  unknown: 'dynamic',
}

const primitives = omit(dartType, "object", "array", "unknown")

function processSchema(properties: UnknownRecord): string[] {
    return Object.entries(properties).map(([key, value]) => {
        const type = (value as UnknownRecord).type as keyof typeof dartType
        const dType = dartType[type]

        if (Object.keys(primitives).includes(type)) return `'${key}': JsonRendererValidator.ofType(${dType}),`
        // TODO(AbhiShake1): handle array
        if(type === "array") return `handle array`

        const properties = ((value as UnknownRecord | undefined)?.properties ?? {}) as UnknownRecord
        return `
        '${key}': JsonRendererValidator.fromMap({
          ${processSchema(properties).join('')}
        }),`
    })
}

function processBuild(properties: UnknownRecord): string[] {
    return Object.entries(properties).map(([key, value]) => {
        const type = (value as UnknownRecord).type as keyof typeof dartType
        const dType = dartType[type]

        if (Object.keys(primitives).includes(type)) return `${key}: params['${key}'] as ${dType}?,`
        // TODO(AbhiShake1): handle array

        const val = value as UnknownRecord
        const properties = (val.properties ?? {}) as UnknownRecord
        return `
        '${key}': ${toTitleCase(key)}({
           ${processBuild(properties).join('')}
        }),`
    })
}

export function FlutterOutput() {
  const { schema } = useSchemaStore()

  let schemaJson: UnknownRecord

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    schemaJson = JSON.parse(JSON.parse(JSON.stringify(schema)))
  } catch (e) {
    schemaJson = {}
  }

  const title = toTitleCase((schemaJson.title ?? "") as string)

  const properties = (schemaJson.properties ?? {}) as UnknownRecord
  const schemaProcessed = processSchema(properties)

  const buildProcessed = processBuild(properties)

  const output = `
class JsonRenderer${title}Plugin extends JsonRendererPlugin {
  JsonRenderer${title}Plugin({super.key});

  @override
  JsonRendererSchema get schema => {
        ${schemaProcessed.join('')}
      };

  @override
  Widget build(BuildContext context) {
    final textStyle = params['text_style'];
    final fontStyle = textStyle?['font_style']?.toString();
    return ${title}(
		${buildProcessed.join('')}
    );
  }

  @override
  String get type => '${title}';
}
	`

  return <pre>
    <code>{output}</code>
  </pre>
}
