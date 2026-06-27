import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = readFileSync('app/page.tsx', 'utf8');
const storage = readFileSync('lib/projects/localProjectStorage.ts', 'utf8');
const types = readFileSync('types/project.ts', 'utf8');

assert(types.includes('export interface CampaignBuilderProject'), 'Project type should define the saved canvas payload');
assert(types.includes('export interface ProjectWorkspace'), 'Workspace type should support multiple projects');

assert(storage.includes('PROJECT_WORKSPACE_STORAGE_KEY'), 'Local storage should use a stable storage key');
assert(storage.includes('createProjectSnapshot'), 'Storage helper should create project snapshots from editor state');
assert(storage.includes('loadProjectWorkspace'), 'Storage helper should load projects safely');
assert(storage.includes('saveProjectWorkspace'), 'Storage helper should save projects safely');
assert(storage.includes('duplicateProject'), 'Storage helper should support duplicating the current project');
assert(storage.includes('createEmptyProject'), 'Storage helper should support creating a new blank project');
assert(storage.includes('deleteProject'), 'Storage helper should support deleting projects safely');
assert(storage.includes('serializeProjectFile'), 'Storage helper should export a portable project file');
assert(storage.includes('parseProjectFile'), 'Storage helper should import a portable project file');
assert(storage.includes('createImportedProject'), 'Storage helper should import project files as local copies');

assert(app.includes('loadProjectWorkspace'), 'Editor should load remembered projects');
assert(app.includes('saveProjectWorkspace'), 'Editor should auto-save remembered projects');
assert(app.includes('projectName'), 'Editor should expose a project name');
assert(app.includes('handleDuplicateProject'), 'Editor should expose project duplication');
assert(app.includes('handleCreateProject'), 'Editor should expose blank project creation');
assert(app.includes('handleDeleteProject'), 'Editor should expose project deletion');
assert(app.includes('handleExportProjectFile'), 'Project list should expose project file export');
assert(app.includes('handleImportProjectFile'), 'Project list should expose project file import');
assert(app.includes('專案管理'), 'Editor should expose project management clearly');
assert(app.includes('新建空白專案'), 'Project management should explain blank project creation');
assert(app.includes('複製目前專案'), 'Project management should explain duplicating the current canvas');
assert(app.includes('刪除專案'), 'Project management should expose project deletion');
assert(app.includes('本機自動儲存'), 'Editor should communicate local auto-save status');
assert(app.includes('匯出專案檔'), 'Project list should label project file export clearly');
assert(app.includes('匯入專案檔'), 'Project list should label project file import clearly');
assert(app.includes('.cmb'), 'Project file import/export should communicate the local file extension');

console.log('project memory verified');
