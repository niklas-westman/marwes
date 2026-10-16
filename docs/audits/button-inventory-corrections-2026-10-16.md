# Button inventory corrections — 2026-10-16

The October14 pinned capture (file nybMu3iJUnnOvWtuxjMG8b,
version2410234809276115335) supports more precise dispositions than “unmapped.”
Historical run counts remain historical. The prepared coverage update preserves
all231 existing requirements and adds40 previously omitted approved-focus
requirements plus two Border=False IconButton requirements. It has273
requirements,203 mapped and70 missing fixtures.

## Design work, kept visible

Fourteen theme-specific requirements lack a dedicated selection or approved
applicable composition in the inspected capture:

| Requirements | Count | Required design work |
| --- | ---: | --- |
| XS | 2 | Define XS size/mode or approve independent token/layout rules. |
| Both icons | 2 | Define two-icon padding, icon sizes and content gaps. |
| Persistent toggle | 2 | Define selected/unselected treatment; pointer Pressed is a different state. |
| Neutral/Text/Success/Danger loading | 8 | Define variant-specific spinner, caption, spacing and state-paint composition. |

These rows use `needs-design` and skip **visual review only**. They retain required
proofs and the family denominator. The Spinner page has generic disable/prepend
instructions (1737:10712 /1780:1603); the missing authority is the applicable
variant composition, not loading as a whole. Scoped absence findings follow an
inspection of all2821 Button/IconButton page nodes, all23 Classic Spinner
instances and matching guidance in the23624-node raw capture.

## Existing authority requiring enrollment

Primary loading exists on the Spinner page: light1780:2692 (112×40, “Loading…”)
and dark1780:2744 (103×40, “Loading”). Content/label binds Primary surface/label
variables2276:28215/28216. Preserve those different captions and exact modes;
use case-level animation stabilization. These two rows remain mapping/enrollment
work, with no visual waiver.

Generic icon-only feature rows can bind the existing neutral/md IconButton
selection, case `button.icon-only-neutral-default`, nodes3875:60969/3875:61055.
The coverage update makes that scope explicit and retains the dedicated design
rows. It does not certify every possible icon-only variant/size combination.

Full-width source exists: vertical Fill=True master1594:7408 and Primary child
1594:7410 describe filling a320px parent. The horizontal group1594:7332 and child
1594:7334 describe filling remaining space beside a sibling. Proposed public
fullWidth scope is the vertical fill-parent rule at320px. Keep its two rows in
the mapping/decision queue until that applicability and source modes are settled.

## Approved focus applicability

DC-009 applies standard focus to variants, purpose wrappers and IconButton:
2px ring with4px clear gap, including dark Semantic focus/ring #ABABFD.
The existing12 generic variant/theme rows omitted19 purpose wrappers×two themes
and IconButton×two themes. The corrected inventory has52 `rule-defined` focus
requirements. They need source-derived mappings, actual keyboard focus-visible
proof and matching independent visual evidence; no missing-design waiver applies.

Standard source1364:11348, Ring1461:13442 and rationale3977:38650 independently
supply the rule. The rationale intentionally omits built-in interactive focus
variants in favor of CSS :focus-visible. Bounded source-rule compilation and real
Tab assertions are implemented for the first two primary-focus cases. The other
50 focus obligations remain unenrolled. Their coverage cannot inherit a pass
from the primary control.

## Reference capture rejection

The first source-example capture f85ebb3d-47fe-4692-ba05-f0e7e2e4bd4c created two
frames from Standard example3977:38660. The frame named dark retained light
Semantic modes because legacy Frame Prep copies source modes without explicit
theme selection. Its ring is #2F31FC; the approved dark rule requires #ABABFD.
Do not enroll or promote that dark image. Preserve it as diagnostic evidence.

The desktop URL/name and sole bridge client were independently checked; Figma
reported a null file key. Capture provenance retains null and must not be described
as independently reported-key verification. A versioned explicit-mode policy and
fresh capture/readback were required before focus-reference enrollment.
The corrected capture4d7e0f96-d080-4245-a85f-9337761527b3 explicitly selects and
reads back Semantic light/dark modes. It supplies the two enrolled references.
Master and example exports are byte-identical per mode.

No source/reference promotion or owner run acceptance is implied by this audit.
Local detailed evidence and inventory investigation are in
`.reflection/button-last-mile-0.6.0/`.

## Exact staged source/reference review

Stage55f3fd80-b964-4359-8abd-10ddd4a819a3 contains377 artifacts, including187
lossless WebP references and their receipts. Its input fingerprint is
93085ff1683b61e80d24eee58ccc90abfb30cbddd279529b3026a7ffc1a2c210; stage hash
7b63f7fa3803ba736b26d00e934c2b06ab469cc0a97e0af8dc25766d2934ae89.
It is unapproved and unpromoted. Source-root selection and explicit mode policy
are provenance-bound; the Figma null file-key qualification above still applies.
