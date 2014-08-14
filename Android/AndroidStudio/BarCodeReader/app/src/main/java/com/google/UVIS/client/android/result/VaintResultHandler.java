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
import android.app.AlertDialog;
import android.content.DialogInterface;

import com.google.UVIS.client.android.CaptureActivity;
import com.google.UVIS.client.android.R;
import com.google.UVIS.client.result.ParsedResult;

public class VaintResultHandler extends ResultHandler {

	  private static final int[] buttons = { R.string.button_vaint 
		                                   , R.string.button_cancel };
	
    public VaintResultHandler(Activity activity, ParsedResult result)
    {
        super(activity, result);
	}
	
	@Override
	public final int getButtonCount() {
		return buttons.length;
	}

	@Override
	public final int getButtonText(int index) {
		return buttons[index];
	}

	@Override
	public final void handleButtonPress(int index) {
	    String text = getResult().getDisplayResult();
	    switch (index) {
	      case 0:
	        VaintValidate();
	      case 1:
	    	ButtonCancel();
	        break;
	    }
	}

	@Override
	public final int getDisplayTitle() {
		return R.string.result_vaint;
	}
	
	private void ButtonCancel()
	{
		((CaptureActivity) getActivity()).restartPreviewAfterDelay(0L);
	}
	
	private void VaintValidate() {

		AlertDialog.Builder valDlgbuilder = new AlertDialog.Builder(getActivity());
				
		valDlgbuilder.setMessage(R.string.vaint_validation_text)
	            .setTitle(R.string.app_name) 
	            .setIcon(R.drawable.vaint_validate)
	            .setPositiveButton(R.string.vaint_purchase
	            		          , new DialogInterface.OnClickListener(){

	            		public void onClick(DialogInterface dialog, int which) {               
	 	    	   //...
	 	    	   }
	            })
	    	    .setNegativeButton(R.string.vaint_reject
	            		          , new DialogInterface.OnClickListener(){

	            		public void onClick(DialogInterface dialog, int which) {               
	 	    	   //...
	 	    	   }
	 	    	   }); 

		AlertDialog validationDialog = valDlgbuilder.create();
			       
		validationDialog.show();   		
		
		
	}
	
}
