<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="配置">
                    <common-form-item-checkbox type="common" :custom="{
                        formItem: {
                            label: '读取权限(read)',
                        },
                        checkboxGroup: {
                            value: model.read,
                            onUpdateValue: (val) => { model.read = val.map(v => v as Group) }
                        },
                        checkboxList: [
                            ...groupTypeList
                        ]
                    }" />
                    <common-form-item-checkbox type="common" :custom="{
                        formItem: {
                            label: '写入权限(write)',
                        },
                        checkboxGroup: {
                            value: model.write,
                            onUpdateValue: (val) => { model.write = val.map(v => v as Group) }
                        },
                        checkboxList: [
                            ...groupTypeList
                        ]
                    }" />
                    <common-form-item-checkbox type="common" :custom="{
                        formItem: {
                            label: '执行权限(execute)',
                        },
                        checkboxGroup: {
                            value: model.execute,
                            onUpdateValue: (val) => { model.execute = val.map(v => v as Group) }
                        },
                        checkboxList: [
                            ...groupTypeList
                        ]
                    }" />
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value :data="[
                {
                    label: '八进制(octal)',
                    value: resRequest.data.value?.octal || '',
                    valueActions: [
                        {
                            type: 'simple',
                            shortcut: {
                                'icon.name': 'common-copy',
                                'button.onClick': () => { copy(resRequest.data.value?.octal || '') }
                            }
                        }
                    ]
                },
                {
                    label: '符号(symbolic)',
                    value: resRequest.data.value?.symbolic || '',
                    valueActions: [
                        {
                            type: 'simple',
                            shortcut: {
                                'icon.name': 'common-copy',
                                'button.onClick': () => { copy(resRequest.data.value?.symbolic || '') }
                            }
                        }
                    ]
                },
            ]" />
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="tsx">
import { reduce, get } from 'lodash-es';
export type Scope = 'read' | 'write' | 'execute';
export type Group = 'owner' | 'group' | 'public';

export type GroupPermissions = {
    [k in Scope]: boolean;
};

export type Permissions = {
    [k in Group]: GroupPermissions;
};

export type Model = {
    read: Group[],
    write: Group[],
    execute: Group[],
}

export type Result = {
    octal: string,
    symbolic: string,
}
const model = reactive<Model>({
    read: ['owner'],
    write: ['owner'],
    execute: ['owner'],
})
const groupTypeList = [
    { label: '所有者(Owner)', value: 'owner' },
    { label: '组(Group)', value: 'group' },
    { label: '公共(Public)', value: 'public' },
]
const copy = useCopy()
const formRef = useTemplateRef("form")
const computeChmodOctalRepresentation = ({ permissions }: { permissions: Permissions }): string => {
    const permissionValue = { read: 4, write: 2, execute: 1 };

    const getGroupPermissionValue = (permission: GroupPermissions) =>
        reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? get(permissionValue, key, 0) : 0), 0);

    return [
        getGroupPermissionValue(permissions.owner),
        getGroupPermissionValue(permissions.group),
        getGroupPermissionValue(permissions.public),
    ].join('');
}

const computeChmodSymbolicRepresentation = ({ permissions }: { permissions: Permissions }): string => {
    const permissionValue = { read: 'r', write: 'w', execute: 'x' };

    const getGroupPermissionValue = (permission: GroupPermissions) =>
        reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? get(permissionValue, key, '') : '-'), '');

    return [
        getGroupPermissionValue(permissions.owner),
        getGroupPermissionValue(permissions.group),
        getGroupPermissionValue(permissions.public),
    ].join('');
}


const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const permissions: Permissions = {
            owner: {
                read: model.read.includes("owner"),
                write: model.write.includes("owner"),
                execute: model.execute.includes("owner"),
            },
            group: {
                read: model.read.includes("group"),
                write: model.write.includes("group"),
                execute: model.execute.includes("group"),
            },
            public: {
                read: model.read.includes("public"),
                write: model.write.includes("public"),
                execute: model.execute.includes("public"),
            },
        }
        const octal = computeChmodOctalRepresentation({ permissions })
        const symbolic = computeChmodSymbolicRepresentation({ permissions })
        res = {
            octal,
            symbolic
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>