---
to: src/<%=names%>/dto/update-<%=name%>.dto.ts
---
import { PartialType } from '@nestjs/mapped-types';
import { Create<%=Name%>Dto } from './create-<%=name%>.dto';

export class Update<%=Name%>Dto extends PartialType(Create<%=Name%>Dto) {}
