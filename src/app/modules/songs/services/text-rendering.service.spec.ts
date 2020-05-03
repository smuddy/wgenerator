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
c c# db c7   cmaj7    c/e
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
    expect(sections[0].number).toBe(0);
    expect(sections[1].type).toBe(SectionType.Verse);
    expect(sections[1].number).toBe(1);
    expect(sections[2].type).toBe(SectionType.Chorus);
    expect(sections[2].number).toBe(0);
    expect(sections[3].type).toBe(SectionType.Bridge);
    expect(sections[3].number).toBe(0);
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
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const sections = service.parse(testText);
    expect(sections[0].lines[0].type).toBe(LineType.chord);
    expect(sections[0].lines[0].text).toBe('C D E F G A H');
    expect(sections[0].lines[2].type).toBe(LineType.chord);
    expect(sections[0].lines[2].text).toBe(' a d e f g a h c b');
    expect(sections[1].lines[0].type).toBe(LineType.chord);
    expect(sections[1].lines[0].text).toBe('C D E F G A H');
    expect(sections[1].lines[2].type).toBe(LineType.chord);
    expect(sections[1].lines[2].text).toBe(' a d e f g a h c b');
    expect(sections[2].lines[0].type).toBe(LineType.chord);
    expect(sections[2].lines[0].text).toBe('c c# db c7   cmaj7    c/e');

    // c c# db c7   cmaj7    c/e
    expect(sections[2].lines[0].chords).toEqual([
      {chord: 'c', length: 2, position: 0},
      {chord: 'c#', length: 3, position: 2},
      {chord: 'db', length: 3, position: 5},
      {chord: 'c', length: 2, position: 8, add: '7'},
      {chord: 'c', length: 5, position: 13, add: 'maj7'},
      {chord: 'c', length: 3, position: 22, slashChord: 'e'},
    ]);
  });
});
