import React from 'react'
import { Session } from 'next-auth'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from './ui/sidebar'
import { ListTodo, Dumbbell, ChartSpline } from 'lucide-react'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    session: Session | null
} 

export default function AppSidebar(
    { session, ...props }: AppSidebarProps)  
{
    const items = [
        // { to: "/dashboard", title: 'Dashboard' },
        { url: "/habits", title: 'Habits', icon: ListTodo },
        { url: "/exercise", title: 'Exercise', icon: Dumbbell },
    ]

    return (
        <Sidebar collapsible='offcanvas' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
                                <ChartSpline className="!size-5" />
                                <span className="text-base font-semibold">Dot Habits</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}