<template>
    <n-dropdown trigger="click" :options="options" @select="handleSelect" placement="bottom-end">
        <normal-icon class="cursor-pointer rounded-[6px] hover:bg-hoverColor" name="user-avatar-btn" />
    </n-dropdown>
    <DefineTemplate>
        <div class="px-[12px] py-[10px]" v-if="user.current.value">
            {{ `${user.current.value.name}(${user.current.value.email})` }}
        </div>
    </DefineTemplate>
</template>
<script setup lang="ts">
import { type DropdownOption } from "naive-ui";
import { SvgIcon, UserLoginOrRegister } from "#components";

const user = useCurrentUser();
const routeHelper = useRouteHelper();
const editTabs = useEditTabs()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
const dialog = useDialog();
const options = computed<DropdownOption[]>(() => {
    const list: DropdownOption[] = [];
    if (user.current.value) {
        list.push(
            ...[
                {
                    key: "user-info",
                    type: "render",
                    render: () => h(ReuseTemplate),
                },
                {
                    label: "用户设置",
                    key: "user-setting",
                    icon: () =>
                        h(SvgIcon, {
                            name: "user-avatar-setting",
                        }),
                },
            ]
        );
        if (user.current.value.isAdmin || user.current.value.isSuper) {
            list.push({
                label: "管理员后台",
                key: "admin-setting",
                icon: () =>
                    h(SvgIcon, {
                        name: "user-avatar-admin",
                    }),
            });
        }
        if (user.current.value.isSuper) {
            list.push({
                label: "超管后台",
                key: "super-admin-setting",
                icon: () =>
                    h(SvgIcon, {
                        name: "user-avatar-super-admin",
                    }),
            });
        }
        list.push({
            label: "退出登录",
            key: "logout",
            icon: () =>
                h(SvgIcon, {
                    name: "user-avatar-logout",
                }),
        });
    } else {
        list.push({
            label: "登录",
            key: "login",
            icon: () =>
                h(SvgIcon, {
                    name: "user-avatar-login",
                }),
        });
    }
    return list;
});
const handleSelect = async (key: string | number) => {
    if (key === "logout") {
        showLogoutDialog();
    }
    if (key === "login") {
        showLoginDialog();
    }
    // if (key === "user-setting") {
    //     editTabs.addTab(ToolName['user-setting'])
    // }
    // if (key === "admin-setting") {
    //     editTabs.addTab(ToolName['admin-manager'])
    // }
    if (key === "super-admin-setting") {
        editTabs.addTab(ToolName['super-manager'])
    }
};
const showLoginDialog = () => {
    dialog.create({
        showIcon: false,
        style: {
            // width: "200px",
        },
        title: "登录",
        content: () => {
            return h(UserLoginOrRegister);
        },
    });
};
const logoutRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/user/logout");
    if (!res) {
        throw new Error("退出登录失败")
    }
    await routeHelper.reload()
});
const showLogoutDialog = () => {
    dialog.warning({
        title: "退出登录",
        content: "确定退出登录吗？",
        positiveText: "确定",
        negativeText: "不确定",
        onPositiveClick: async () => {
            await logoutRequest.runAsync();
        },
        onNegativeClick: () => { },
    });
};
</script>