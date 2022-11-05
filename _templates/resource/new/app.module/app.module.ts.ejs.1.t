---
inject: true
to: src/app.module.ts
after: 	imports
skip_if: <%=h.capitalize(name)%>Module
---
    <%=h.capitalize(name)%>Module,