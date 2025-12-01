// @TODO analisar separação do estilo e opção de criar board propriamente com template ao selecionar no modal

import kanbanTemplate from "@board/components/templates/kanbanTemplate";
import scrumTemplate from "@board/components/templates/scrumTemplate";

export const boardTemplates = {
    kanban: kanbanTemplate,
    scrum: scrumTemplate,
};

export default boardTemplates;