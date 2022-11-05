---
inject: true
to: src/app.module.ts
at_line: 0
skip_if: import { <%=h.capitalize(name)%>Module }
---
import { <%=h.capitalize(name)%>Module } from './<%=name%>/<%=name%>.module';