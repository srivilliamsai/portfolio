import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../src/data/projects.js';
import {projectStories} from '../src/data/projectStories.js';
import {searchKnowledge,welcome} from '../src/services/assistantKnowledge.js';

test('every listed project has distinct, addressable case-study sections and a complete architecture',()=>{
  assert.deepEqual(Object.keys(projectStories).sort(),projects.map(project=>project.id).sort());
  for(const project of projects){
    const story=projectStories[project.id];
    const ids=['intro',...story.sections.map(section=>section.id)];
    assert.equal(new Set(ids).size,ids.length,`${project.id}: duplicate navigation target`);
    assert.ok(ids.every(id=>/^[a-z][a-z0-9-]*$/.test(id)));
    for(const target of ['overview','problem','product-flow','frontend','architecture','design-system','outcomes','tradeoffs','takeaway'])assert.ok(ids.includes(target),`${project.id}: missing ${target}`);
    const architecture=story.sections.find(section=>section.id==='architecture').diagram;
    assert.ok(architecture.layers.length>=3);
    assert.ok(architecture.layers.every(layer=>layer.nodes.length&&layer.nodes.every(node=>node.title&&node.detail)));
  }
});
test('case-study facts are retrievable with each project and preserve the native/cloud boundaries',()=>{
  const glassora=searchKnowledge('Glassora architecture',1)[0];
  assert.equal(glassora.id,'glassora');
  assert.match(glassora.text,/Firebase Firestore/);assert.match(glassora.text,/Cloudflare R2/);
  const wyndra=searchKnowledge('Wyndra architecture',1)[0];
  assert.equal(wyndra.id,'wyndra');assert.match(wyndra.text,/WeatherService/);
  assert.match(wyndra.text,/does not use the Java backend from Carbon Footprint/);
  const pitstop=searchKnowledge('PitStop architecture',1)[0];
  assert.match(pitstop.text,/Flutter/);assert.match(pitstop.text,/Spring Cloud Gateway/);
});
test('the assistant introduces itself with its new public name',()=>{
  assert.match(welcome,/I'm WILL/);assert.doesNotMatch(welcome,/\bVILL\b/);
});

test('flow diagrams cover all projects with connected decision paths and product-specific steps',async()=>{
  const {projectDiagrams}=await import('../src/data/projectDiagrams.js');
  for(const project of projects){
    const diagram=projectDiagrams[project.id];
    assert.ok(diagram,project.id);
    const ids=new Set(diagram.nodes.map(node=>node.id));
    assert.equal(ids.size,diagram.nodes.length);
    for(const edge of diagram.edges){assert.ok(ids.has(edge.from));assert.ok(ids.has(edge.to));}
    const decision=diagram.nodes.find(node=>node.type==='decision');
    const branches=diagram.edges.filter(edge=>edge.from===decision.id);
    assert.deepEqual(branches.map(edge=>edge.label).sort(),['No','Yes']);
    assert.ok(diagram.nodes.every(node=>diagram.edges.some(edge=>edge.from===node.id||edge.to===node.id)));
    assert.equal(diagram.walkthrough.steps.length,4);
    assert.equal(diagram.walkthrough.outputs.length,2);
    assert.ok(diagram.walkthrough.steps.every(step=>step.detail&&step.title&&step.tag));
  }
});
test('new SaaS case-study routes have one grounded assistant record each',()=>{
  for(const id of ['dinedesk','invoice-picker']){
    const results=searchKnowledge(id,20).filter(record=>record.id===id);
    assert.equal(results.length,1);
    assert.ok(results[0].links.some(link=>link.href===`/${id}`));
  }
});


test('every project has an addressable six-step operations model with product-specific explanations',async()=>{
  const {projectOperations}=await import('../src/data/projectOperations.js');
  assert.deepEqual(Object.keys(projectOperations).sort(),projects.map(project=>project.id).sort());
  for(const project of projects){
    const operation=projectOperations[project.id];
    assert.equal(projectStories[project.id].sections.filter(section=>section.automation).length,1);
    assert.equal(operation.steps.length,6);
    assert.equal(new Set(operation.steps.map(step=>step.id)).size,6);
    assert.equal(new Set(operation.steps.map(step=>step.title)).size,6);
    assert.ok(operation.steps.every(step=>step.label&&step.icon&&step.detail));
    assert.doesNotMatch(operation.title,/overnight/i);
  }
  assert.match(projectOperations['invoice-picker'].steps.find(step=>step.label==='PDF').detail,/browser; cloud sync is a separate responsibility/);
  assert.match(projectOperations.wyndra.steps.find(step=>step.label==='REQUEST').detail,/OpenWeather/);
  assert.match(projectOperations.glassora.steps.find(step=>step.label==='IMAGE').detail,/Cloudflare R2/);
});

test('isometric board and every raised part fit the responsive model without clipping',async()=>{
  const {operationSlots,isoBox,isoPoint}=await import('../src/services/projectDiagramGeometry.js');
  const shapes=[{x:0,y:0,width:260,depth:190,height:9,z:-9},...operationSlots];
  for(const shape of shapes){
    for(const point of Object.values(isoBox(shape)).flat()){
      assert.ok(point.every(Number.isFinite));
      assert.ok(point[0]>=0&&point[0]<=460);
      assert.ok(point[1]>=0&&point[1]<=330);
    }
  }
  for(const box of operationSlots){
    assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=260&&box.y+box.depth<=190);
    const label=isoPoint(box.x+box.width/2,box.y+box.depth+13);
    assert.ok(label[0]>=0&&label[0]<=460&&label[1]+9<=330);
  }
});
