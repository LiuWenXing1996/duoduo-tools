<template>
    <tool-wrapper>
        <template #input>
            <n-form :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" label="读取权限(read)" path="read">
                        <n-checkbox-group v-model:value="model.read">
                            <n-space>
                                <template v-for="item in groupTypeList">
                                    <n-checkbox :="item" />
                                </template>
                            </n-space>
                        </n-checkbox-group>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" label="写入权限(write)" path="write">
                        <n-checkbox-group v-model:value="model.write">
                            <n-space>
                                <template v-for="item in groupTypeList">
                                    <n-checkbox :="item" />
                                </template>
                            </n-space>
                        </n-checkbox-group>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" label="执行权限(execute)" path="execute">
                        <n-checkbox-group v-model:value="model.execute">
                            <n-space>
                                <template v-for="item in groupTypeList">
                                    <n-checkbox :="item" />
                                </template>
                            </n-space>
                        </n-checkbox-group>
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :data="[
                {
                    label: '八进制(octal)',
                    value: result?.octal || '',
                    valueActions: [
                        {
                            name: 'common-copy',
                            onClick: () => { copy(result?.octal || '') }
                        }
                    ]
                },
                {
                    label: '符号(symbolic)',
                    value: result?.symbolic || '',
                    valueActions: [
                        {
                            name: 'common-copy',
                            onClick: () => { copy(result?.symbolic || '') }
                        }
                    ]
                },
            ]" />
        </template>
    </tool-wrapper>
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
const message = useAnyMessage()
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

const result = computedAsync(async () => {
    let res: Result | undefined = undefined;
    try {
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
        message.anyError(error);
        res = undefined
    }
    return res;
})
</script>