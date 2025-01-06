<template>
    <tool-content :output="{
        scroll: {
            disabled: true
        },
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => {
                        copy(resRequest.data.value?.content || '')
                    }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="内容">
                    <n-form-item :="commonFormItemProps" path="content" label="输入">
                        <n-input clearable type="textarea" :rows="6" v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
                <tool-area label="美化配置">
                    <n-form-item :="commonFormItemProps" path="config.language" label="SQL 方言">
                        <n-select :options="languageOptions" v-model:value="model.config.language" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.tabWidth" label="Tab 长度">
                        <n-input-number v-model:value="model.config.tabWidth" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.useTabs" label="使用制表符">
                        <n-switch v-model:value="model.config.useTabs" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.keywordCase" label="关键字格式">
                        <n-select :options="keywordCaseOptions" v-model:value="model.config.keywordCase" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.dataTypeCase" label="数据类型格式">
                        <n-select :options="dataTypeCaseOptions" v-model:value="model.config.dataTypeCase" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.functionCase" label="函数格式">
                        <n-select :options="functionCaseOptions" v-model:value="model.config.functionCase" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.identifierCase" label="标识符格式">
                        <n-select :options="identifierCaseOptions" v-model:value="model.config.identifierCase" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.indentStyle" label="缩进样式">
                        <n-select :options="indentStyleOptions" v-model:value="model.config.indentStyle" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.expressionWidth" label="表达式宽度">
                        <n-input-number v-model:value="model.config.expressionWidth" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.linesBetweenQueries" label="查询之间的行数">
                        <n-input-number v-model:value="model.config.linesBetweenQueries" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.logicalOperatorNewline" label="逻辑运算符换行">
                        <n-select :options="logicalOperatorNewlineOptions"
                            v-model:value="model.config.logicalOperatorNewline" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.denseOperators" label="紧凑运算符">
                        <n-switch v-model:value="model.config.denseOperators" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="config.newlineBeforeSemicolon" label="分号前换行">
                        <n-switch v-model:value="model.config.newlineBeforeSemicolon" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import { format, type DataTypeCase, type FormatOptionsWithLanguage, type FunctionCase, type IdentifierCase, type IndentStyle, type KeywordCase, type LogicalOperatorNewline, type SqlLanguage } from 'sql-formatter';
import type * as monacoType from 'monaco-editor';
export type Model = {
    content: string,
    config: Omit<FormatOptionsWithLanguage, "params" | "paramTypes">
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: "",
    config: {
        language: "sql",
        tabWidth: 2,
        useTabs: false,
        keywordCase: "preserve",
        dataTypeCase: "preserve",
        functionCase: "preserve",
        identifierCase: "preserve",
        indentStyle: "standard",
        logicalOperatorNewline: "before",
        expressionWidth: 50,
        linesBetweenQueries: 1,
        denseOperators: false,
        newlineBeforeSemicolon: false
    }
})
const copy = useCopy()
onMounted(() => {
    model.content = `select supplier_name,city from
(select * from suppliers join addresses on suppliers.address_id=addresses.id)
as suppliers
where supplier_id>500
order by supplier_name asc,city desc;`
})

const formRef = useTemplateRef("form")
const languageOptions = defineSelectOptionList<Record<SqlLanguage, unknown>>({
    sql: { label: "SQL" },
    redshift: { label: "AWS Redshift" },
    bigquery: { label: "BigQuery" },
    db2: { label: "DB2" },
    db2i: { label: "DB2i for IBM i" },
    hive: { label: "Hive" },
    mariadb: { label: "MariaDB" },
    mysql: { label: "MySQL" },
    n1ql: { label: "N1QL" },
    plsql: { label: "PL/SQL" },
    postgresql: { label: "PostgreSQL" },
    singlestoredb: { label: "SingleStoreDB" },
    snowflake: { label: "Snowflake" },
    spark: { label: "Spark" },
    sqlite: { label: "SQLite" },
    tidb: { label: "TiDB" },
    transactsql: { label: "Transact-SQL" },
    trino: { label: "Trino" },
    tsql: { label: "T-SQL" },
})
const keywordCaseOptions = defineSelectOptionList<Record<KeywordCase, unknown>>({
    preserve: { label: "保持原样" },
    upper: { label: "大写" },
    lower: { label: "小写" }
})
const dataTypeCaseOptions = defineSelectOptionList<Record<DataTypeCase, unknown>>({
    upper: { label: "大写" },
    lower: { label: "小写" },
    preserve: { label: "保持原样" }
});
const functionCaseOptions = defineSelectOptionList<Record<FunctionCase, unknown>>({
    preserve: { label: "保持原样" },
    upper: { label: "大写" },
    lower: { label: "小写" }
})
const identifierCaseOptions = defineSelectOptionList<Record<IdentifierCase, unknown>>({
    preserve: { label: "保持原样" },
    upper: { label: "大写" },
    lower: { label: "小写" }
})
const indentStyleOptions = defineSelectOptionList<Record<IndentStyle, unknown>>({
    standard: { label: "标准" },
    tabularLeft: { label: "左对齐" },
    tabularRight: { label: "右对齐" }
});
const logicalOperatorNewlineOptions = defineSelectOptionList<Record<LogicalOperatorNewline, unknown>>({
    before: { label: "之前" },
    after: { label: "之后" }
});
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const initOutputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'sql');
    const editor = monaco.editor.create(editorContainer, {
        model: model,
        readOnly: true,
        minimap: {
            enabled: false,
        },
    });
    outputEditor.value = editor
    const initText = resRequest.data.value?.content || "";
    editor.setValue(initText)
    return editor
}
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const content = format(model.content, {
            ...model.config
        });
        res = {
            content
        }
    } catch (error) {
        resRequest.mutate(undefined)
        outputEditor.value?.setValue("")
        throw error
    }
    outputEditor.value?.setValue(res.content || "")
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: false
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>