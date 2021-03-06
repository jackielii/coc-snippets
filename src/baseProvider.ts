import { Document } from 'coc.nvim'
import { Position, Range } from 'vscode-languageserver-types'
import { Snippet, SnippetEdit } from './types'
import { distinct } from './util'

export interface Config {
  extends: { [index: string]: string[] }
  [key: string]: any
}

export default abstract class BaseProvider {
  constructor(protected config: Config) {
  }

  abstract init(): Promise<void>
  abstract getSnippets(filetype: string): Snippet[]
  abstract getSnippetFiles(filetype: string): string[]
  abstract getTriggerSnippets(document: Document, position: Position, autoTrigger?: boolean): Promise<SnippetEdit[]>
  abstract resolveSnippetBody(snippet: Snippet, range: Range, line: string): Promise<string>

  public async checkContext(_context: string): Promise<any> {
    return true
  }

  public getFiletypes(filetype: string): string[] {
    let extend = this.config.extends ? this.config.extends[filetype] : null
    let filetypes = filetype.split('.')
    if (extend && extend.length) {
      filetypes = extend.concat(filetypes)
    }
    filetypes.reverse()
    return distinct(filetypes)
  }
}
