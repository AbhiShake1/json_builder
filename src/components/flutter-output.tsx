"use client"

import {useSchemaStore} from "~/stores/schema"
import {omit} from "lodash"
import {Button} from "~/components/ui/button";
import {toast} from "sonner";
import {CopyIcon} from "@radix-ui/react-icons";

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
        if (type === "array") return `handle array`

        const properties = ((value as UnknownRecord | undefined)?.properties ?? {}) as UnknownRecord
        return `
        '${key}': JsonRendererValidator.fromMap({
          ${processSchema(properties).join('\n')}
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
        '${key}': ${toTitleCase(key)}(
           ${processBuild(properties).join('\n')}
        ),`
    })
}

export function FlutterOutput({componentName, componentId}: { componentName: string, componentId: number }) {
    const {schema: s} = useSchemaStore()

    const schema = s[componentId]

    let schemaJson: UnknownRecord

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        schemaJson = JSON.parse(JSON.parse(JSON.stringify(schema)))
    } catch (e) {
        schemaJson = {}
    }

    const title = toTitleCase(componentName)

    const properties = (schemaJson.properties ?? {}) as UnknownRecord
    const schemaProcessed = processSchema(properties)

    const buildProcessed = processBuild(properties)

    const output = `
class JsonRenderer${title}Plugin extends JsonRendererPlugin {
  JsonRenderer${title}Plugin({super.key});

  @override
  JsonRendererSchema get schema => {
        ${schemaProcessed.join('\n')}
      };

  @override
  Widget build(BuildContext context) {
    return ${title}(
		${buildProcessed.join('\n')}
    );
  }

  @override
  String get type => '${title}';
}
	`

    return <div
        className="relative flex h-full min-h-[50vh] flex-col p-4 lg:col-span-2 rounded-lg border border-dashed shadow-sm">
        <Button variant="outline" className="absolute right-3 top-3 space-x-2" onClick={async () => {
            await navigator.clipboard.writeText(output)
            toast.success('Code copied to clipboard')
        }}>
            <CopyIcon/>
            <h1>Copy</h1>
        </Button>
        <pre>
            <code>{output}</code>
        </pre>
    </div>
}
