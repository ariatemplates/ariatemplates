/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Aria.classDefinition({
    $classpath : "app.css.DatePickerSkin",
    $singleton : true,
    $prototype : {

        skinObject : {
            "std" : {
                "generalBackgroundColor" : "white",
                "generalPadding" : "5px",
                "generalBorder" : "1px solid #DFDFDF",
                "generalBorderRadius" : "6px",
                "icon" : {
                    "url" : "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVGhlIGljb24gY2FuIGJlIHVzZWQgZnJlZWx5IGluIGJvdGggcGVyc29uYWwgYW5kIGNvbW1lcmNpYWwgcHJvamVjdHMgd2l0aCBubyBhdHRyaWJ1dGlvbiByZXF1aXJlZCwgYnV0IGFsd2F5cyBhcHByZWNpYXRlZC4gCllvdSBtYXkgTk9UIHN1Yi1saWNlbnNlLCByZXNlbGwsIHJlbnQsIHJlZGlzdHJpYnV0ZSBvciBvdGhlcndpc2UgdHJhbnNmZXIgdGhlIGljb24gd2l0aG91dCBleHByZXNzIHdyaXR0ZW4gcGVybWlzc2lvbiBmcm9tIGljb25tb25zdHIuY29tIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB2ZXJzaW9uPSIxLjEiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCA1MTIgNTEyIgogICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJpY29ubW9uc3RyLWNhbGVuZGFyLTUtaWNvbi5zdmciPjxtZXRhZGF0YQogICBpZD0ibWV0YWRhdGE5Ij48cmRmOlJERj48Y2M6V29yawogICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlCiAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgIGlkPSJkZWZzNyIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE2ODAiCiAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjgiCiAgIGlkPSJuYW1lZHZpZXc1IgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGlua3NjYXBlOnpvb209IjAuNDYwOTM3NSIKICAgaW5rc2NhcGU6Y3g9Ii04Mi40NDA2NzgiCiAgIGlua3NjYXBlOmN5PSIyNTYiCiAgIGlua3NjYXBlOndpbmRvdy14PSIxNjcyIgogICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CjxwYXRoCiAgIGlkPSJjYWxlbmRhci01LWljb24iCiAgIGQ9Ik0xOTcuNDUzLDI5NS45NTFoLTU4LjkwNXYtNTguOTA0aDU4LjkwNVYyOTUuOTUxeiBNMjg2LjQ1MiwyMzcuMDQ3aC01OC45MDR2NTguOTA0aDU4LjkwNFYyMzcuMDQ3eiAgIE0zNzUuNDUyLDIzNy4wNDdoLTU4LjkwNXY1OC45MDRoNTguOTA1VjIzNy4wNDd6IE0xOTcuNDUzLDMyMy4wNDdoLTU4LjkwNXY1OC45MDZoNTguOTA1VjMyMy4wNDd6IE0yODYuNDUyLDMyMy4wNDdoLTU4LjkwNCAgdjU4LjkwNmg1OC45MDRWMzIzLjA0N3ogTTM3NS40NTEsMzIzLjA0N2gtNTguOTA0djU4LjkwNmg1OC45MDRWMzIzLjA0N3ogTTM5Ny4zODksMTE4LjEzMWMwLDEwLjAzNS04LjEzNSwxOC4xNzEtMTguMTcsMTguMTcxICBzLTE4LjE3MS04LjEzNi0xOC4xNzEtMTguMTcxVjcyLjQwMmMwLTEwLjAzNCw4LjEzNi0xOC4xNywxOC4xNzEtMTguMTdzMTguMTcsOC4xMzYsMTguMTcsMTguMTdWMTE4LjEzMXogTTE1MS44ODksNzIuMzIgIGMwLTEwLjAzNS04LjEzNi0xOC4xNzEtMTguMTctMTguMTcxYy0xMC4wMzYsMC0xOC4xNzEsOC4xMzYtMTguMTcxLDE4LjE3MXY0NS43MjhjMCwxMC4wMzUsOC4xMzUsMTguMTcxLDE4LjE3MSwxOC4xNzEgIGMxMC4wMzQsMCwxOC4xNy04LjEzNiwxOC4xNy0xOC4xNzFWNzIuMzJ6IE00MTkuMzUyLDk4Ljg1MXYxOC42MTZjMCwyMi4xMy0xOC4wMDQsNDAuMTM0LTQwLjEzMyw0MC4xMzQgIGMtMjIuMTMsMC00MC4xMzQtMTguMDA0LTQwLjEzNC00MC4xMzRWOTguODUxSDE3My44NTJ2MTguNTMzYzAsMjIuMTMtMTguMDA0LDQwLjEzNC00MC4xMzMsNDAuMTM0ICBjLTIyLjEzLDAtNDAuMTM0LTE4LjAwNC00MC4xMzQtNDAuMTM0Vjk4Ljg1MUg1MHYzNTloNDEydi0zNTlINDE5LjM1MnogTTQyMiw0MTcuODUxSDkwVjE5NS4zOGgzMzJWNDE3Ljg1MXoiCiAgIHN0eWxlPSJmaWxsOiM3ZjhkOWE7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPg==",
                    "width" : "26px",
                    "height" : "26px",
                    "backgroundColor" : "white",
                    "border" : "1px solid #DFDFDF",
                    "borderRadius" : "6px"
                }
            },
            "marker" : {
                "generalBackgroundColor" : "#f8f8f8",
                "generalPadding" : "5px",
                "generalBorder" : "1px solid #22ade6",
                "generalBorderRadius" : "6px",
                "icon" : {
                    "url" : "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVGhlIGljb24gY2FuIGJlIHVzZWQgZnJlZWx5IGluIGJvdGggcGVyc29uYWwgYW5kIGNvbW1lcmNpYWwgcHJvamVjdHMgd2l0aCBubyBhdHRyaWJ1dGlvbiByZXF1aXJlZCwgYnV0IGFsd2F5cyBhcHByZWNpYXRlZC4gCllvdSBtYXkgTk9UIHN1Yi1saWNlbnNlLCByZXNlbGwsIHJlbnQsIHJlZGlzdHJpYnV0ZSBvciBvdGhlcndpc2UgdHJhbnNmZXIgdGhlIGljb24gd2l0aG91dCBleHByZXNzIHdyaXR0ZW4gcGVybWlzc2lvbiBmcm9tIGljb25tb25zdHIuY29tIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB2ZXJzaW9uPSIxLjEiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCA1MTIgNTEyIgogICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJpY29ubW9uc3RyLWNhbGVuZGFyLTUtaWNvbi5zdmciPjxtZXRhZGF0YQogICBpZD0ibWV0YWRhdGE5Ij48cmRmOlJERj48Y2M6V29yawogICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlCiAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgIGlkPSJkZWZzNyIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE2ODAiCiAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjgiCiAgIGlkPSJuYW1lZHZpZXc1IgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGlua3NjYXBlOnpvb209IjAuNDYwOTM3NSIKICAgaW5rc2NhcGU6Y3g9Ii04Mi40NDA2NzgiCiAgIGlua3NjYXBlOmN5PSIyNTYiCiAgIGlua3NjYXBlOndpbmRvdy14PSIxNjcyIgogICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CjxwYXRoCiAgIGlkPSJjYWxlbmRhci01LWljb24iCiAgIGQ9Ik0xOTcuNDUzLDI5NS45NTFoLTU4LjkwNXYtNTguOTA0aDU4LjkwNVYyOTUuOTUxeiBNMjg2LjQ1MiwyMzcuMDQ3aC01OC45MDR2NTguOTA0aDU4LjkwNFYyMzcuMDQ3eiAgIE0zNzUuNDUyLDIzNy4wNDdoLTU4LjkwNXY1OC45MDRoNTguOTA1VjIzNy4wNDd6IE0xOTcuNDUzLDMyMy4wNDdoLTU4LjkwNXY1OC45MDZoNTguOTA1VjMyMy4wNDd6IE0yODYuNDUyLDMyMy4wNDdoLTU4LjkwNCAgdjU4LjkwNmg1OC45MDRWMzIzLjA0N3ogTTM3NS40NTEsMzIzLjA0N2gtNTguOTA0djU4LjkwNmg1OC45MDRWMzIzLjA0N3ogTTM5Ny4zODksMTE4LjEzMWMwLDEwLjAzNS04LjEzNSwxOC4xNzEtMTguMTcsMTguMTcxICBzLTE4LjE3MS04LjEzNi0xOC4xNzEtMTguMTcxVjcyLjQwMmMwLTEwLjAzNCw4LjEzNi0xOC4xNywxOC4xNzEtMTguMTdzMTguMTcsOC4xMzYsMTguMTcsMTguMTdWMTE4LjEzMXogTTE1MS44ODksNzIuMzIgIGMwLTEwLjAzNS04LjEzNi0xOC4xNzEtMTguMTctMTguMTcxYy0xMC4wMzYsMC0xOC4xNzEsOC4xMzYtMTguMTcxLDE4LjE3MXY0NS43MjhjMCwxMC4wMzUsOC4xMzUsMTguMTcxLDE4LjE3MSwxOC4xNzEgIGMxMC4wMzQsMCwxOC4xNy04LjEzNiwxOC4xNy0xOC4xNzFWNzIuMzJ6IE00MTkuMzUyLDk4Ljg1MXYxOC42MTZjMCwyMi4xMy0xOC4wMDQsNDAuMTM0LTQwLjEzMyw0MC4xMzQgIGMtMjIuMTMsMC00MC4xMzQtMTguMDA0LTQwLjEzNC00MC4xMzRWOTguODUxSDE3My44NTJ2MTguNTMzYzAsMjIuMTMtMTguMDA0LDQwLjEzNC00MC4xMzMsNDAuMTM0ICBjLTIyLjEzLDAtNDAuMTM0LTE4LjAwNC00MC4xMzQtNDAuMTM0Vjk4Ljg1MUg1MHYzNTloNDEydi0zNTlINDE5LjM1MnogTTQyMiw0MTcuODUxSDkwVjE5NS4zOGgzMzJWNDE3Ljg1MXoiCiAgIHN0eWxlPSJmaWxsOiM3ZjhkOWE7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPg==",
                    "width" : "26px",
                    "height" : "26px",
                    "backgroundColor" : "#F5FF00",
                    "border" : "1px solid #22ade6",
                    "borderRadius" : "6px"
                }
            }
        }
    }
});