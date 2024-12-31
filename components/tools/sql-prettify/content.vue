<template>
    <define-tool-wrapper :output="{
        scroll: {
            disabled: true
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="内容">
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '输入',
                        },
                        input: {
                            type: 'textarea',
                            rows: 6,
                            value: model.content,
                            onUpdateValue: (value) => {
                                model.content = value
                            }
                        }
                    }" />
                </define-tool-area>
                <define-tool-area label="美化配置">
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: 'SQL 方言',
                        },
                        select: {
                            options: languageOptions,
                            value: model.config.language,
                            onUpdateValue: (value) => {
                                model.config.language = value
                            }
                        }
                    }" />
                    <common-form-item-input-number type="common" :custom="{
                        formItem: {
                            label: 'Tab 长度',
                        },
                        inputNumber: {
                            value: model.config.tabWidth,
                            onUpdateValue: (value) => {
                                model.config.tabWidth = value ?? 0
                            }
                        }
                    }" />
                    <common-form-item-switch type="common" :custom="{
                        formItem: {
                            label: '使用制表符'
                        },
                        switch: {
                            value: model.config.useTabs,
                            onUpdateValue: (value) => {
                                model.config.useTabs = value
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '关键字格式'
                        },
                        select: {
                            options: keywordCaseOptions,
                            value: model.config.keywordCase,
                            onUpdateValue: (value) => {
                                model.config.keywordCase = value
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '数据类型格式'
                        },
                        select: {
                            options: dataTypeCaseOptions,
                            value: model.config.dataTypeCase,
                            onUpdateValue: (value) => {
                                model.config.dataTypeCase = value
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '函数格式'
                        },
                        select: {
                            options: functionCaseOptions,
                            value: model.config.functionCase,
                            onUpdateValue: (value) => {
                                model.config.functionCase = value
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '标识符格式'
                        },
                        select: {
                            options: identifierCaseOptions,
                            value: model.config.identifierCase,
                            onUpdateValue: (value) => {
                                model.config.identifierCase = value
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '缩进样式'
                        },
                        select: {
                            options: indentStyleOptions,
                            value: model.config.indentStyle,
                            onUpdateValue: (value) => {
                                model.config.indentStyle = value
                            }
                        }
                    }" />
                    <common-form-item-input-number type="common" :custom="{
                        formItem: {
                            label: '表达式宽度'
                        },
                        inputNumber: {
                            value: model.config.expressionWidth,
                            onUpdateValue: (value) => {
                                model.config.expressionWidth = value ?? 0
                            }
                        }
                    }" />
                    <common-form-item-input-number type="common" :custom="{
                        formItem: {
                            label: '查询之间的行数'
                        },
                        inputNumber: {
                            value: model.config.linesBetweenQueries,
                            onUpdateValue: (value) => {
                                model.config.linesBetweenQueries = value ?? 0
                            }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '逻辑运算符换行'
                        },
                        select: {
                            options: logicalOperatorNewlineOptions,
                            value: model.config.logicalOperatorNewline,
                            onUpdateValue: (value) => {
                                model.config.logicalOperatorNewline = value
                            }
                        }
                    }" />

                    <common-form-item-switch type="common" :custom="{
                        formItem: {
                            label: '紧凑运算符'
                        },
                        switch: {
                            value: model.config.denseOperators,
                            onUpdateValue: (value) => {
                                model.config.denseOperators = value
                            }
                        }
                    }" />
                    <common-form-item-switch type="common" :custom="{
                        formItem: {
                            label: '分号前换行'
                        },
                        switch: {
                            value: model.config.newlineBeforeSemicolon,
                            onUpdateValue: (value) => {
                                model.config.newlineBeforeSemicolon = value
                            }
                        }
                    }" />
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
            ]" />
        </template>
    </define-tool-wrapper>
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