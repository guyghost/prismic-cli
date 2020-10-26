import { mergeRight } from 'ramda';
import globals from './globals';
import Helpers from './helpers';
import LocalDB from './services/localDB';

function argsToMap(args) {
  const withValueRegex = new RegExp('^--.+$');
  if (!args) return {};
  const argts = {};
  let current = null;
  args.forEach((value) => {
    if (value.match(withValueRegex)) {
      argts[value] = true;
      current = value;
    } else {
      argts[current] = value;
    }
  });
  return argts;
}

function parseArgs(args) {
  const argsMap = argsToMap(args);

  return {
    base: argsMap['--base'],
    baseUrl: argsMap['--base-url'],
    domain: argsMap['--domain'],
    endpoint: argsMap['--endpoint'],
    debug: argsMap['--debug'],
    version: argsMap['--version'],
    folder: argsMap['--folder'],
    noconfirm: argsMap['--noconfirm'],
    isNew: argsMap['--new'],
    users: argsMap['--users'],
    Auth: {
      email: argsMap['--email'],
      password: argsMap['--password'],
      oauthAccessToken: argsMap['--oauthaccesstoken'],
    },
    Themes: {
      url: argsMap['--theme-url'],
      template: argsMap['--template'],
      conf: argsMap['--conf'],
      ignoreConf: argsMap['--ignore-conf'],
    },
    SliceMachine: {
      lib: argsMap['--lib'],
      library: argsMap['--library'],
      yes: argsMap['--noconfirm'] || argsMap['--yes'] || argsMap['-y'],
      ls: argsMap['--ls'],
      setup: argsMap['--setup'],
      develop: argsMap['--develop'],
      bootstrap: argsMap['--bootstrap'],
      createSlice: argsMap['--create-slice'],
      addStorybook: argsMap['--add-storybook'],
      localSlicesPath: argsMap['--local-path'],
      noPrismic: argsMap['--no-prismic'],
      framework: argsMap['--framework'],
      templatePath: argsMap['--template-path'],
      apiEndpoint: argsMap['--sm-endpoint'],
      override: argsMap['--override'],
      sliceName: argsMap['--slice-name'],
      localLibrary: argsMap['--local-library'],
      customTypeEndpoint: argsMap['--ct-endpoint'] || argsMap['--custom-type-endpoint'],
    },
  };
}

// eslint-disable-next-line import/no-mutable-exports
export let ctx = null;

export function build(command, args) {
  const localData = LocalDB.getAll();
  const parsedArgs = parseArgs(args);

  ctx = Object.assign({}, {
    cookies: localData.cookies,
    base: parsedArgs.base || localData.base || globals.DEFAULT_BASE,
    baseUrl: parsedArgs.baseUrl,
    endpoint: parsedArgs.endpoint || localData.endpoint,
    domain: parsedArgs.domain,
    debug: parsedArgs.debug,
    folder: parsedArgs.folder,
    noConfirm: parsedArgs.noConfirm,
    isNew: parsedArgs.isNew,
    users: parsedArgs.users,
    version: parsedArgs.version,
    Auth: {
      email: parsedArgs.Auth.email,
      password: parsedArgs.Auth.password,
      oauthAccessToken: parsedArgs.Auth.oauthAccessToken,
      magicLink: localData.magicLink,
    },
    Themes: {
      template: parsedArgs.Themes.template,
      url: parsedArgs.Themes.url,
      ignoreConf: parsedArgs.Themes.ignoreConf,
      conf: parsedArgs.Themes.conf || Helpers.Theme.defaultConfigPath,
    },
    SliceMachine: {
      lib: parsedArgs.SliceMachine.lib || parsedArgs.SliceMachine.library,
      yes: parsedArgs.SliceMachine.yes,
      ls: parsedArgs.SliceMachine.ls,
      setup: parsedArgs.SliceMachine.setup,
      develop: parsedArgs.SliceMachine.develop,
      bootstrap: parsedArgs.SliceMachine.bootstrap,
      createSlice: parsedArgs.SliceMachine.createSlice,
      addStorybook: parsedArgs.SliceMachine.addStorybook,
      localSlicesPath: parsedArgs.SliceMachine.localSlicesPath || globals.DEFAULT_LOCAL_SLICES_PATH,
      noPrismic: parsedArgs.SliceMachine.noPrismic,
      framework: parsedArgs.SliceMachine.framework,
      templatePath: parsedArgs.SliceMachine.templatePath,
      apiEndpoint: parsedArgs.SliceMachine.apiEndpoint || localData.apiEndpoint || globals.DEFAULT_SM_ENDPOINT,
      sliceName: parsedArgs.SliceMachine.sliceName,
      localLibrary: parsedArgs.SliceMachine.localLibrary,
      customTypeEndpoint: parsedArgs.SliceMachine.customTypeEndpoint,
    },
  }, { ...command.context });
  return ctx;
}

export function setCookies(cookies) {
  ctx = mergeRight(ctx, { cookies });
  LocalDB.set({ cookies });
}

export function setMagicLink(magicLink) {
  ctx = mergeRight(ctx, { Auth: { magicLink } });
  LocalDB.set({ magicLink });
}
 
export function setBase(base) {
  ctx = mergeRight(ctx, { base });
  LocalDB.set({ base });
}

export function getBase() {
  return LocalDB.get('base');
}

export function setSlicemachineEndpoint(endpoint) {
  ctx = mergeRight(ctx, { SliceMachine: { apiEndpoint: endpoint } });
  LocalDB.set({ apiEndpoint: endpoint });
}
