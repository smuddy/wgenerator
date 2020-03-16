import {TestBed} from '@angular/core/testing';

import {LineType, SectionType, TextRenderingService} from './text-rendering.service';

describe('TextRenderingService', () => {
  const testText = `Strophe
C D E F G A H
Text Line 1-1
 a d e f g a h c b
Text Line 2-1

Strophe
C D E F G A H
Text Line 1-2
 a d e f g a h c b
Text Line 2-2

Refrain
c# cb c7 cmaj7 c/e
and the chorus

Bridge
Cool bridge without any chords
`;


  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextRenderingService = TestBed.get(TextRenderingService);
    expect(service).toBeTruthy();
  });

  it('should parse section types', () => {
    const service: TextRenderingService = TestBed.get(TextRenderingService);
    const sections = service.parse(testText);
    expect(sections[0].type).toBe(SectionType.Verse);
    expect(sections[1].type).toBe(SectionType.Verse);
    expect(sections[2].type).toBe(SectionType.Chorus);
    expect(sections[3].type).toBe(SectionType.Bridge);
  });

  it('should parse text lines', () => {
    const service: TextRenderingService = TestBed.get(TextRenderingService);
    const sections = service.parse(testText);
    expect(sections[0].lines[1].type).toBe(LineType.text);
    expect(sections[0].lines[1].text).toBe('Text Line 1-1');
    expect(sections[0].lines[3].type).toBe(LineType.text);
    expect(sections[0].lines[3].text).toBe('Text Line 2-1');
    expect(sections[1].lines[1].type).toBe(LineType.text);
    expect(sections[1].lines[1].text).toBe('Text Line 1-2');
    expect(sections[1].lines[3].type).toBe(LineType.text);
    expect(sections[1].lines[3].text).toBe('Text Line 2-2');
    expect(sections[2].lines[1].type).toBe(LineType.text);
    expect(sections[2].lines[1].text).toBe('and the chorus');
    expect(sections[3].lines[0].type).toBe(LineType.text);
    expect(sections[3].lines[0].text).toBe('Cool bridge without any chords');
  });

  it('should parse chord lines', () => {
    const service: TextRenderingService = TestBed.get(TextRenderingService);
    const sections = service.parse(testText);
    expect(sections[0].lines[0].type).toBe(LineType.chrod);
    expect(sections[0].lines[0].text).toBe('C D E F G A H');
    expect(sections[0].lines[2].type).toBe(LineType.chrod);
    expect(sections[0].lines[2].text).toBe(' a d e f g a h c b');
    expect(sections[1].lines[0].type).toBe(LineType.chrod);
    expect(sections[1].lines[0].text).toBe('C D E F G A H');
    expect(sections[1].lines[2].type).toBe(LineType.chrod);
    expect(sections[1].lines[2].text).toBe(' a d e f g a h c b');
    expect(sections[2].lines[0].type).toBe(LineType.chrod);
    expect(sections[2].lines[0].text).toBe('c# cb c7 cmaj7 c/e');
  });
});
