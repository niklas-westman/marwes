# Button source authority audit — 2026-10-15

Read-only source investigation for the full Button inventory. Source file
`nybMu3iJUnnOvWtuxjMG8b`, raw version `2410234809276115335`, last modified
`2026-10-14T15:02:45Z`. This audit records existing design facts, not owner
approval, reference promotion or completed runtime compliance.

## Available state selections

State collection `VariableCollectionId:2276:28206`: Default `2276:15`, Hover
`2276:16`, Pressed `2276:17`, Disabled `2276:18`, Error `2276:20`. Semantic theme
modes are light `1358:1`, dark `1358:2`; preserve inherited collection choices.
These examples have right icons. Match the actual icon and caption, not an
unrelated wrapper default.

| Variant | State | Light | Dark |
| --- | --- | --- | --- |
| Success | Default | 3872:41874 | 3873:43622 |
| Success | Hover | 3872:41974 | 3873:43624 |
| Success | Pressed | 3872:42020 | 3873:43626 |
| Success | Disabled | 3872:42066 | 3873:43628 |
| Success | Error | 3872:42112 | 3873:43630 |
| Danger | Default | 3872:41884 | 3873:43632 |
| Danger | Hover | 3872:41976 | 3873:43634 |
| Danger | Pressed | 3872:42022 | 3873:43636 |
| Danger | Disabled | 3872:42068 | 3873:43638 |
| Danger | Error | 3872:42114 | 3873:43640 |
| Ghost | Default | 3873:43029 | 3873:43652 |
| Ghost | Hover | 3873:43035 | 3873:43654 |
| Ghost | Pressed | 3873:43040 | 3873:43656 |
| Ghost | Disabled | 3873:43045 | 3873:43658 |
| Ghost | Error | 3873:43050 | 3873:43660 |
| Primary | Error | 3872:42106 | 3873:43600 |
| Secondary | Error | 3872:42503 | 3873:43610 |
| Text | Error | 3872:42110 | 3873:43620 |

Success master `1371:7806`; Destructive master `1364:11356`; Ghost set
`3873:42868`. Ghost is a real design, but mapping the public neutral variant to
it is a separate explicit product choice. Its label/icon bind button/text
variables, not the similarly named button/neutral variables.

## Available purpose selections

Catalog roots: light `1371:8933`, dark `3978:39020`.

| Purpose | Light | Dark | Source selection |
| --- | --- | --- | --- |
| Submit | 3978:38799 | 3978:39031 | Primary, no icon, Submit |
| Save | 3978:38811 | 3978:39038 | Primary, no icon, Save |
| Create | 3978:38817 | 3978:39077 | Primary, no icon, Create |
| Cancel | 3978:38786 | 3978:39045 | Ghost, no icon |
| Confirm | 3870:26925 | 3978:39052 | Success, right check |
| Destructive | 3870:26915 | 3978:39059 | Destructive, right X |
| Verify | 3978:38823 | 3978:39066 | Secondary, left icon |
| Edit | 3978:38840 | 3978:39084 | Secondary, left icon |
| Upload | 3978:38849 | 3978:39091 | Secondary, left icon |
| Download | 3978:38858 | 3978:39098 | Secondary, left icon |
| Copy | 3978:38867 | 3978:39105 | Ghost, no icon |
| Search | 3978:38920 | 3978:39116 | Primary, left icon |
| Filter | 3978:38873 | 3978:39123 | Ghost, no icon |
| Sort | 3978:38879 | 3978:39130 | Ghost, no icon |
| Dropdown | 3978:38933 | 3978:39137 | Secondary, right icon, Options |
| Navigation | 3873:42981 | 3978:39152 | Link master 1365:12377, Link |
| Close | 3978:38903 | 3978:39209 | Ghost, no icon |
| Refresh | 3978:38909 | 3978:39216 | Ghost, left refresh |

The public Success purpose can use the explicit Success selection above; there
is no separate Purpose/Success row. Source-selected size and default size must
remain distinguished. A fixture overriding an icon does not prove that a wrapper's
canonical default icon matches the catalog. Default changes must be documented
and cross-adapter semantics checked.

## Other independent authority and open choices

- Secondary Loading exists on the Spinner page: light `1780:2719`, dark
  `1780:2767`, label “Please wait”, 121×40, Spinner/Classic `1737:10526`.
  Animation phase and native disabled behavior need explicit test treatment.
- Standard focus `1364:11348`, high contrast `1364:11352`; accessibility examples
  `3977:38660` / `3977:38676`; ring/offset variables `3973:38643` / `3973:38644`.
  On 2026-10-15 Niklas approved the captured standard 2px ring / 4px clear gap
  across Button variants, purpose wrappers and IconButton. This establishes shared
  standard-focus policy; Increased contrast remains separate. New composed
  reference selections must carry that approved policy explicitly.
- Size collection `1593:4566` has sm/md/lg only (`1593:6`, `1593:5`, `1593:7`).
  XS requires a design decision; do not alias it silently to small.
- Icon Button has dedicated masters `1595:13935` / `3017:36466` and examples
  `3875:60969` / `3875:61055`. Decide whether the inventory row means this public
  IconButton component or arbitrary Button iconOnly combinations.
- No two-icon selection was found. Other variants' loading composition is not
  established by the Secondary example.
- Fill=True Button-group masters `1594:7332` / `1594:7408` provide layout authority,
  but standalone fullWidth applicability still needs an explicit selection.
- Filter intent mentions toggling; persistent selected appearance remains a
  separate missing design choice.
- Submit, reset, navigation, keyboard, disabled and accessible-name behavior can
  be validated from the public semantic contracts without inventing Figma imagery.

See the [decision queue](design-compliance-decisions.md) and
[rollout tracker](../guides/design-compliance-rollout.md). Availability here does
not itself enroll a case, satisfy its proof or approve a visual result.

## Additional direct master selections

Two remaining captured masters have independent light-mode authority even though
the pinned file contains no instances of them:

| Selection | Master | Independent geometry and parts |
| --- | --- | --- |
| Success with leading Check | `3873:42712` | 100×40, md, 12px icon, 16px horizontal/12px vertical padding, 4px gap; content `3873:42713`, label `3873:42714`, icon `3873:42715`, overlay `3873:42716` |
| Destructive with leading X | `3873:42719` | 91×36, 12px icon, fixed 16px horizontal/10px vertical padding, 6px gap; content `3873:42720`, label `3873:42721`, icon `3873:42722`, overlay `3873:42723` |

These selections use light `1358:1`, Default state `2276:15` and icon size 12
`2541:7`. Their enrollment does not establish dark variants or arbitrary size
combinations. Destructive's fixed geometry does not redefine generic small size.
