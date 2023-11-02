/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// This plugin is a port from Alyxia's Vendetta plugin
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { Margins } from "@utils/margins";
import { copyWithToast } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { Button, Forms } from "@webpack/common";
import { User } from "discord-types/general";
import virtualMerge from "virtual-merge";

interface UserProfile extends User {
    themeColors?: Array<number>;
}

var faeffect;
var faeframe;

// Courtesy of Cynthia.
function decode(bio: string): Array<number> | null {
    if (bio == null) return null;
    
    faeframe = bio.match(
        /ff:/
        );
    faeffect = /fe:"(.*?)"/.exec(bio)?.[1];
    return faeffect
}
    

const settings = definePluginSettings({
    nitroFirst: {
        description: "-",
        type: OptionType.SELECT,
        options: [
            { label: "-", value: true, default: true },
            { label: "-", value: false },
        ]
    }
});

export default definePlugin({
    name: "faeffect",
    description: "Allows profile frame and effect selection via text in bio.",
    authors: [Devs.fayestival],
    patches: [
        {
            find: "UserProfileStore",
            replacement: {
                match: /(?<=getUserProfile\(\i\){return )(\i\[\i\])/,
                replace: "$self.colorDecodeHook($1)"
            }
        },
    ],


    settingsAboutComponent: () => (
        <Forms.FormSection>
            <Forms.FormTitle tag="h3">Usage</Forms.FormTitle>
            <Forms.FormText>
                After enabling this plugin, you will see frames and effects from people also using faeffect. <br />
                To set your own colors:
                <ul>
                    <li>• go to your profile settings</li>
                    <li>• find the id for the frame or effect you want</li>
                    <li>• use ff:"idhere" as a frame id template, and fe:"idhere" for effects</li>
                    <li>• put the text anywhere in your bio, on a new line</li>
                    <li>uses code from decor and freeprofilethemes! thanks to alyxia and fiery</li>
                </ul><br />
            </Forms.FormText>
        </Forms.FormSection>),
    settings,
    colorDecodeHook(user: UserProfile) {
        if (user) {
            // don't replace colors if already set with nitro
            if (settings.store.nitroFirst && user.profileEffectID) return user;
            const colors = decode(user.bio);
            if (colors) {
                return virtualMerge(user, {
                    premiumType: 2,
                    profileEffectID: faeffect
                });
            }
        }
        return user;
    }
});
