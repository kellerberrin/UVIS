/*
 * Copyright (c) 2014 kellerberrin
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *     limitations under the License.
 */

package com.google.UVIS.client.android.result;

import android.app.Activity;
import android.util.Log;
import android.view.View;

import com.google.UVIS.client.android.R;
import com.google.UVIS.client.result.GS1ParsedResult;
import com.google.UVIS.client.result.ParsedResult;


/**
 * Created by
 * @author kellerberrin (James McCulloch)
 * email: james.duncan.mcculloch@gmail.com
 * @since 20/04/2014.
 *
 */
public final class GTINResultHandler  extends ResultHandler
{
        private static final int[] buttons = {
                R.string.button_product_search,
                R.string.button_web_search,
                R.string.button_custom_product_search
        };

        public GTINResultHandler(Activity activity, ParsedResult result)
        {
            super(activity, result);

            showGoogleShopperButton(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (getResult() instanceof GS1ParsedResult) {
                        GS1ParsedResult GTINResult = (GS1ParsedResult) getResult();
                        openGoogleShopper(GTINResult.GetGTIN().GetGTINString());
                    }
                    else
                    {
                        Log.e("GTINResultHandler", "Unexpected error with result type");
                    }
                }
            });
        }

        @Override
        public int getButtonCount() {
            return hasCustomProductSearch() ? buttons.length : buttons.length - 1;
        }

        @Override
        public int getButtonText(int index) {
            return buttons[index];
        }

        @Override
        public void handleButtonPress(int index) {
            GS1ParsedResult GTINResult = (GS1ParsedResult) getResult();
            switch (index) {
                case 0:
                    openProductSearch(GTINResult.GetGTIN().GetGTINString());
                    break;
                case 1:
                    webSearch(GTINResult.GetGTIN().GetGTINString());
                    break;
                case 2:
                    openURL(fillInCustomSearchURL(GTINResult.GetGTIN().GetGTINString()));
                    break;
            }
        }

        @Override
        public int getDisplayTitle() { return R.string.result_GTIN; }

}

